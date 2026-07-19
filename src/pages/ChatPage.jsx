import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { SYSTEM_PROMPT, AI_MODELS, DEFAULT_MODEL } from "@/lib/config/aiProviders";
import { trackUsage } from "@/lib/usage";
import { Menu, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import ChatInputBar from "@/components/chat/ChatInputBar";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatEmptyState from "@/components/chat/ChatEmptyState";
import ThinkingIndicator from "@/components/chat/ThinkingIndicator";

export default function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [modelDropdown, setModelDropdown] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [likedMessages, setLikedMessages] = useState([]);
  const [dislikedMessages, setDislikedMessages] = useState([]);

  // Generation state
  const [phase, setPhase] = useState("idle"); // "idle" | "thinking" | "streaming"
  const [streamingContent, setStreamingContent] = useState("");

  // Refs for streaming control
  const streamIntervalRef = useRef(null);
  const abortRef = useRef(false);
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Auto-scroll on new content
  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent, phase, scrollToBottom]);

  // Load chat list
  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const data = await base44.entities.Chat.filter({}, "-last_message_at", 50);
      setChats(data);
    } catch (err) {
      console.error("Failed to load chats:", err);
    }
  };

  // Load messages when chatId changes
  useEffect(() => {
    if (chatId) {
      loadMessages(chatId);
    } else {
      setMessages([]);
      setLoading(false);
    }
    // Cleanup any active streaming
    setPhase("idle");
    setStreamingContent("");
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    abortRef.current = true;
  }, [chatId]);

  const loadMessages = async (id) => {
    setLoading(true);
    try {
      const data = await base44.entities.Message.filter({ chat_id: id }, "created_date", 100);
      setMessages(data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  };

  const createNewChat = () => {
    navigate("/chat");
    setMessages([]);
    setInput("");
    setSidebarOpen(false);
    setPhase("idle");
    setStreamingContent("");
  };

  const deleteChat = async (id, e) => {
    e?.stopPropagation();
    if (!confirm("Delete this conversation?")) return;
    try {
      await base44.entities.Chat.delete(id);
      await base44.entities.Message.deleteMany({ chat_id: id });
      setChats(chats.filter((c) => c.id !== id));
      if (chatId === id) {
        navigate("/chat");
        setMessages([]);
      }
    } catch (err) {
      console.error("Failed to delete chat:", err);
    }
  };

  // Stream text progressively
  const startStreaming = (fullText, onComplete) => {
    abortRef.current = false;
    let index = 0;
    const charsPerTick = Math.max(2, Math.ceil(fullText.length / 200));

    setPhase("streaming");
    setStreamingContent("");

    streamIntervalRef.current = setInterval(() => {
      if (abortRef.current) {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
        onComplete(true);
        return;
      }
      index += charsPerTick;
      if (index >= fullText.length) {
        setStreamingContent(fullText);
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
        onComplete(false);
      } else {
        setStreamingContent(fullText.slice(0, index));
      }
    }, 16);
  };

  const handleSend = async () => {
    const content = input.trim();
    if (!content || phase !== "idle") return;

    setInput("");
    setAttachments([]);
    setPhase("thinking");

    let currentChatId = chatId;
    let msgCount = messages.length;

    try {
      // Create chat if none selected
      if (!currentChatId) {
        const title = content.slice(0, 50) + (content.length > 50 ? "..." : "");
        const newChat = await base44.entities.Chat.create({
          title,
          model: selectedModel,
          system_prompt: SYSTEM_PROMPT,
          last_message_at: new Date().toISOString(),
          message_count: 0,
        });
        currentChatId = newChat.id;
        navigate(`/chat/${currentChatId}`);
        setChats([newChat, ...chats]);
      }

      // Save user message
      const userMsg = await base44.entities.Message.create({
        chat_id: currentChatId,
        role: "user",
        content,
      });
      setMessages((prev) => [...prev, userMsg]);
      msgCount += 1;

      // Build conversation context
      const recentMessages = [...messages, userMsg].slice(-10);
      const contextStr = recentMessages
        .map((m) => {
          if (m.role === "user") return `User: ${m.content}`;
          if (m.role === "assistant") return `Assistant: ${m.content}`;
          return "";
        })
        .filter(Boolean)
        .join("\n\n");

      const fullPrompt = `${SYSTEM_PROMPT}\n\nConversation history:\n${contextStr}\n\nPlease respond to the user's latest message.`;

      // Call AI
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: fullPrompt,
        model: selectedModel === "automatic" ? undefined : selectedModel,
      });

      const assistantContent = typeof response === "string" ? response : JSON.stringify(response);

      // Stream the response
      await new Promise((resolve) => {
        startStreaming(assistantContent, (aborted) => resolve(aborted));
      });

      // Save assistant message
      const assistantMsg = await base44.entities.Message.create({
        chat_id: currentChatId,
        role: "assistant",
        content: assistantContent,
        model: selectedModel,
      });

      setMessages((prev) => [...prev, assistantMsg]);
      msgCount += 1;

      // Update chat metadata
      await base44.entities.Chat.update(currentChatId, {
        last_message_at: new Date().toISOString(),
        message_count: msgCount,
      });

      // Track usage
      trackUsage("ai_message", 1, { model: selectedModel });
      base44.analytics.track({ eventName: "chat_message_sent", properties: { model: selectedModel } });

      loadChats();
    } catch (err) {
      console.error("Failed to send message:", err);
      const errorMsg = await base44.entities.Message.create({
        chat_id: currentChatId,
        role: "assistant",
        content: `⚠️ Error: ${err.message || "Failed to get AI response. Please try again."}`,
      });
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setPhase("idle");
      setStreamingContent("");
      if (streamIntervalRef.current) {
        clearInterval(streamIntervalRef.current);
        streamIntervalRef.current = null;
      }
    }
  };

  const handleStop = () => {
    abortRef.current = true;
    if (streamIntervalRef.current) {
      clearInterval(streamIntervalRef.current);
      streamIntervalRef.current = null;
    }
    setPhase("idle");
  };

  const copyMessage = (id, content) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const addAttachments = (newAtts) => {
    setAttachments((prev) => [...prev, ...newAtts]);
    newAtts.forEach((att) => {
      setTimeout(() => {
        setAttachments((prev) => prev.map((a) => (a.id === att.id ? { ...a, uploading: false } : a)));
      }, 800 + Math.random() * 1200);
    });
  };

  const removeAttachment = (id) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleLike = (id) => {
    setLikedMessages((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    setDislikedMessages((prev) => prev.filter((i) => i !== id));
  };

  const handleDislike = (id) => {
    setDislikedMessages((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
    setLikedMessages((prev) => prev.filter((i) => i !== id));
  };

  const handleDeleteMessage = async (id) => {
    if (!confirm("Delete this response?")) return;
    try {
      await base44.entities.Message.delete(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Failed to delete message:", err);
    }
  };

  const handleRegenerate = async (msg) => {
    if (phase !== "idle") return;
    const msgIndex = messages.findIndex((m) => m.id === msg.id);
    if (msgIndex === -1) return;
    const contextMessages = messages.slice(0, msgIndex);
    setPhase("thinking");
    try {
      const contextStr = contextMessages
        .map((m) => (m.role === "user" ? `User: ${m.content}` : m.role === "assistant" ? `Assistant: ${m.content}` : ""))
        .filter(Boolean)
        .join("\n\n");
      const fullPrompt = `${SYSTEM_PROMPT}\n\nConversation history:\n${contextStr}\n\nPlease respond to the user's latest message.`;
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: fullPrompt,
        model: selectedModel === "automatic" ? undefined : selectedModel,
      });
      const assistantContent = typeof response === "string" ? response : JSON.stringify(response);
      await new Promise((resolve) => {
        startStreaming(assistantContent, () => resolve());
      });
      await base44.entities.Message.update(msg.id, { content: assistantContent });
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, content: assistantContent } : m)));
      trackUsage("ai_message", 1, { model: selectedModel });
    } catch (err) {
      console.error("Failed to regenerate:", err);
    } finally {
      setPhase("idle");
      setStreamingContent("");
    }
  };

  const handleContinue = async (msg) => {
    if (phase !== "idle") return;
    setPhase("thinking");
    try {
      const contextStr = messages
        .map((m) => (m.role === "user" ? `User: ${m.content}` : m.role === "assistant" ? `Assistant: ${m.content}` : ""))
        .filter(Boolean)
        .join("\n\n");
      const fullPrompt = `${SYSTEM_PROMPT}\n\nConversation so far:\n${contextStr}\n\nPlease continue the assistant's last response from where it left off. Do not repeat what was already said.`;
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: fullPrompt,
        model: selectedModel === "automatic" ? undefined : selectedModel,
      });
      const continuation = typeof response === "string" ? response : JSON.stringify(response);
      const newContent = msg.content + "\n\n" + continuation;
      await new Promise((resolve) => {
        startStreaming(continuation, () => resolve());
      });
      await base44.entities.Message.update(msg.id, { content: newContent });
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, content: newContent } : m)));
      trackUsage("ai_message", 1, { model: selectedModel });
    } catch (err) {
      console.error("Failed to continue:", err);
    } finally {
      setPhase("idle");
      setStreamingContent("");
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-zinc-950">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-72 flex-col border-r border-zinc-800 bg-black">
        <ChatSidebar
          chats={chats}
          chatId={chatId}
          createNewChat={createNewChat}
          deleteChat={deleteChat}
          onNavigate={handleNavigate}
        />
      </aside>

      {/* Sidebar - Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, pointerEvents: "none" }}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {sidebarOpen && (
          <motion.aside
            key="sidebar-panel"
            initial={{ x: -288 }}
            animate={{ x: 0 }}
            exit={{ x: -288 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 left-0 w-72 z-50 md:hidden bg-black border-r border-zinc-800 flex flex-col"
          >
            <ChatSidebar
              chats={chats}
              chatId={chatId}
              createNewChat={createNewChat}
              deleteChat={deleteChat}
              onNavigate={handleNavigate}
              onClose={() => setSidebarOpen(false)}
            />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between h-14 px-4 border-b border-zinc-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-zinc-400 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-semibold text-white">
              {chatId ? "Conversation" : "New Chat"}
            </h1>
          </div>

          {/* Model Selector */}
          <div className="relative">
            <button
              onClick={() => setModelDropdown(!modelDropdown)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              {AI_MODELS[selectedModel].name}
              <ChevronDown className="w-3 h-3" />
            </button>
            {modelDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setModelDropdown(false)} />
                <div className="absolute right-0 top-full mt-1 w-64 rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl z-20 max-h-96 overflow-y-auto">
                  {Object.values(AI_MODELS).map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model.id);
                        setModelDropdown(false);
                      }}
                      className={cn(
                        "w-full px-3 py-2.5 text-left hover:bg-zinc-800 transition-colors border-b border-zinc-800/50 last:border-0",
                        selectedModel === model.id && "bg-red-600/10"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white">{model.name}</span>
                        {model.premium && (
                          <span className="text-[10px] text-yellow-500 font-medium">PRO</span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 mt-0.5">{model.description}</p>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </header>

        {/* Messages area */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-5 h-5 text-red-500 animate-spin" />
            </div>
          ) : messages.length === 0 && phase === "idle" ? (
            <ChatEmptyState onPick={(text) => setInput(text)} />
          ) : (
            <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  msg={msg}
                  likedMessages={likedMessages}
                  dislikedMessages={dislikedMessages}
                  onLike={handleLike}
                  onDislike={handleDislike}
                  onRegenerate={handleRegenerate}
                  onContinue={handleContinue}
                  onDelete={handleDeleteMessage}
                />
              ))}

              {/* Thinking indicator */}
              {phase === "thinking" && <ThinkingIndicator />}

              {/* Streaming message */}
              {phase === "streaming" && streamingContent && (
                <ChatMessage
                  msg={{ id: "streaming", role: "assistant", content: streamingContent }}
                  isStreaming={true}
                />
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Floating input bar */}
        <div className="flex-shrink-0 bg-gradient-to-t from-zinc-950 via-zinc-950 to-transparent">
          <ChatInputBar
            input={input}
            setInput={setInput}
            onSend={handleSend}
            onStop={handleStop}
            isGenerating={phase !== "idle"}
            disabled={phase === "thinking"}
            attachments={attachments}
            onAddAttachments={addAttachments}
            onRemoveAttachment={removeAttachment}
          />
        </div>
      </div>
    </div>
  );
}