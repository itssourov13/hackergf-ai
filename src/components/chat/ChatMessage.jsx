import React from "react";
import { motion } from "framer-motion";
import { Terminal, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import MessageActions from "./MessageActions";
import CodeBlock from "./CodeBlock";

export default function ChatMessage({ msg, isStreaming = false, likedMessages = [], dislikedMessages = [], onLike, onDislike, onShare, onRegenerate, onContinue, onDelete }) {
  const isUser = msg.role === "user";
  const liked = likedMessages.includes(msg.id);
  const disliked = dislikedMessages.includes(msg.id);

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="flex justify-end"
      >
        <div className="flex items-start gap-3 max-w-[80%] flex-row-reverse">
          <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center">
            <User className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="bg-gradient-to-br from-zinc-700 to-zinc-800 border border-zinc-700 rounded-2xl rounded-tr-md px-4 py-3 shadow-lg">
            <p className="text-sm text-zinc-100 whitespace-pre-wrap leading-relaxed">{msg.content}</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="flex gap-3"
    >
      {/* AI Avatar */}
      <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-red-600/20 to-zinc-900 border border-red-600/30 flex items-center justify-center">
        <Terminal className="w-4 h-4 text-red-400" />
      </div>

      <div className="group relative flex-1 min-w-0">
        <div className="md-content max-w-none py-1">
            <ReactMarkdown
              components={{
                code({ className, children }) {
                  const match = /language-(\w+)/.exec(className || "");
                  const content = String(children).replace(/\n$/, "");
                  if (match || content.includes("\n")) {
                    return <CodeBlock language={match?.[1] || "text"} code={content} />;
                  }
                  return <code>{children}</code>;
                },
                pre({ children }) {
                  return <>{children}</>;
                },
              }}
            >
              {msg.content}
            </ReactMarkdown>
            {isStreaming && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="inline-block w-[7px] h-[16px] bg-red-500 rounded-sm align-middle ml-0.5 -mb-0.5"
              />
            )}
        </div>

        {/* Action bar */}
        {!isStreaming && msg.content && msg.id !== "streaming" && (
          <MessageActions
            msg={msg}
            liked={liked}
            disliked={disliked}
            onLike={onLike}
            onDislike={onDislike}
            onShare={onShare}
            onRegenerate={onRegenerate}
            onContinue={onContinue}
            onDelete={onDelete}
          />
        )}
      </div>
    </motion.div>
  );
}