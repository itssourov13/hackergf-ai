import React from "react";
import { motion } from "framer-motion";
import { Copy, Check, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

export default function ChatMessage({ msg, isStreaming = false, copiedId, onCopy }) {
  const isUser = msg.role === "user";

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="flex justify-end"
      >
        <div className="flex items-start gap-3 max-w-[80%] flex-row-reverse">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center">
            <User className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="bg-zinc-800/80 border border-zinc-700 rounded-2xl rounded-tr-md px-4 py-3">
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
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-red-600/20 to-red-900/20 border border-red-600/30 flex items-center justify-center">
        <span className="text-xs font-bold text-red-400">AI</span>
      </div>

      <div className="group relative flex-1 min-w-0">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl rounded-tl-md px-4 py-3 backdrop-blur-sm">
          <div className="md-content max-w-none">
            <ReactMarkdown>{msg.content}</ReactMarkdown>
            {isStreaming && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="inline-block w-[7px] h-[16px] bg-red-500 rounded-sm align-middle ml-0.5 -mb-0.5"
              />
            )}
          </div>
        </div>

        {/* Copy button */}
        {!isStreaming && msg.content && (
          <button
            onClick={() => onCopy(msg.id, msg.content)}
            className="absolute -bottom-2.5 left-2 opacity-0 group-hover:opacity-100 flex items-center gap-1 px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-xs text-zinc-400 hover:text-white transition-all"
          >
            {copiedId === msg.id ? (
              <><Check className="w-3 h-3 text-green-500" /> Copied</>
            ) : (
              <><Copy className="w-3 h-3" /> Copy</>
            )}
          </button>
        )}
      </div>
    </motion.div>
  );
}