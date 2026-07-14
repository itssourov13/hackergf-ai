import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { SYSTEM_PROMPT, AI_MODELS, DEFAULT_MODEL } from "@/lib/config/aiProviders";
import ReactMarkdown from "react-markdown";
import { Send, Plus, Trash2, MessageSquare, Loader2, Copy, Check, ChevronDown, Square, RefreshCw, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [modelDropdown, setModelDropdown] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);
  const abortRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const createNewChat = async () => {
    navigate("/chat");
    setMessages([]);
    setInput("");
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

  const handleSend = async (regenerateFrom = null) => {
    const content = regenerateFrom || input.trim();
    if (!content || sending) return;

    setInput("");
    setSending(true);

    let currentChatId = chatId;

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

      // Build conversation context from recent messages
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
        response_json_schema: null,
      });

      const assistantContent = typeof response === "string" ? response : JSON.stringify(response);

      // Save assistant message
      const assistantMsg = await base44.entities.Message.create({
        chat_id: currentChatId,
        role: "assistant",
        content: assistantContent,
        model: selectedModel,
      });
      setMessages((prev) => [...prev, assistantMsg]);

      // Update chat metadata
      await base44.entities.Chat.update(currentChatId, {
        last_message_at: new Date().toISOString(),
        message_count: (messages.length + 2),
      });

      // Refresh chat list
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
      setSending(false);
    }
  };

  const handleStop = () => {
    setSending(false);
  };

  const copyMessage = (id, content) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen">
      {/* Chat Sidebar */}
      <div className="hidden md:flex w-72 flex-col border-r border-zinc-800 bg-black">
        <div className="p-3 border-b border-zinc-800">
          <button
            onClick={createNewChat}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-red-600/10 border border-red-600/30 text-red-400 hover:bg-red-600/20 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {chats.length === 0 ? (
            <div className="text-center py-8 text-sm text-zinc-600">
              No conversations yet
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => navigate(`/chat/${chat.id}`)}
                className={cn(
                  "group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-colors",
                  chatId === chat.id
                    ? "bg-red-600/10 border border-red-900/40"
                    : "hover:bg-zinc-900 border border-transparent"
                )}
              >
                <MessageSquare className="w-4 h-4 text-zinc-500 flex-shrink-0" />
                <span className="flex-1 text-sm text-zinc-300 truncate">{chat.title}</span>
                <button
                  onClick={(e) => deleteChat(chat.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Main Area */}
      <div className="flex-1 flex flex-col bg-zinc-950">
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="p-2 text-zinc-400 hover:text-white" title="Dashboard">
              <Terminal className="w-5 h-5 text-red-500" />
            </Link>
            <button
              onClick={createNewChat}
              className="md:hidden p-2 text-zinc-400 hover:text-white"
            >
              <Plus className="w-5 h-5" />
            </button>
            <h1 className="text-sm font-semibold text-white">
              {chatId ? "Conversation" : "New Chat"}
            </h1>
          </div>

          {/* Model Selector */}
          <div className="relative">
            <button
              onClick={() => setModelDropdown(!modelDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
            >
              {AI_MODELS[selectedModel].name}
              <ChevronDown className="w-3 h-3" />
            </button>
            {modelDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setModelDropdown(false)} />
                <div className="absolute right-0 top-full mt-1 w-64 rounded-lg border border-zinc-800 bg-zinc-900 shadow-2xl z-20 max-h-96 overflow-y-auto">
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
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-600/10 border border-red-600/30 mb-4">
                  <MessageSquare className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Start a conversation</h2>
                <p className="text-sm text-zinc-400 mb-8 max-w-md">
                  Ask anything about code, get explanations, debug issues, or generate new code.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(s)}
                      className="text-left p-3 rounded-lg border border-zinc-800 bg-zinc-900/50 hover:border-red-900/50 hover:bg-zinc-900 transition-all text-sm text-zinc-400 hover:text-zinc-200"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex gap-3",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    {msg.role === "assistant" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-600/10 border border-red-600/30 flex items-center justify-center">
                        <span className="text-xs font-bold text-red-500">AI</span>
                      </div>
                    )}
                    <div
                      className={cn(
                        "group relative max-w-[80%] rounded-xl px-4 py-3",
                        msg.role === "user"
                          ? "bg-red-600/10 border border-red-900/40 text-zinc-100"
                          : "bg-zinc-900 border border-zinc-800 text-zinc-100"
                      )}
                    >
                      {msg.role === "assistant" ? (
                        <div className="md-content max-w-none">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      )}
                      {msg.role === "assistant" && (
                        <button
                          onClick={() => copyMessage(msg.id, msg.content)}
                          className="absolute -bottom-3 right-2 opacity-0 group-hover:opacity-100 flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-xs text-zinc-400 hover:text-white transition-all"
                        >
                          {copiedId === msg.id ? (
                            <><Check className="w-3 h-3" /> Copied</>
                          ) : (
                            <><Copy className="w-3 h-3" /> Copy</>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-600/10 border border-red-600/30 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                    </div>
                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-2 text-sm text-zinc-500">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-zinc-800 bg-black p-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                rows={1}
                className="w-full resize-none rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-3 pr-12 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-900/50 focus:ring-1 focus:ring-red-900/30 max-h-40"
                style={{ minHeight: "48px" }}
                disabled={sending}
              />
              {sending ? (
                <button
                  onClick={handleStop}
                  className="absolute right-2 bottom-2 p-2 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors"
                >
                  <Square className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="absolute right-2 bottom-2 p-2 rounded-lg bg-red-600 text-white hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              )}
            </div>
            <p className="text-xs text-zinc-600 mt-2 text-center">
              HackerAI can make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const SUGGESTIONS = [
  "Write a Python function to reverse a linked list",
  "Explain the difference between async/await and promises in JavaScript",
  "Create a React component for a todo list with local storage",
  "Debug this error: TypeError: Cannot read property 'map' of undefined",
];