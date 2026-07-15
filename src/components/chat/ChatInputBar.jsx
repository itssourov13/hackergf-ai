import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Square, Paperclip, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChatInputBar({ input, setInput, onSend, onStop, isGenerating, disabled }) {
  const textareaRef = useRef(null);

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [input]);

  // Focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating && input.trim()) onSend();
    }
  };

  return (
    <div className="px-4 pb-4 pt-2">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className={cn(
            "relative flex items-end gap-2 rounded-[28px] border backdrop-blur-xl transition-all duration-300",
            "bg-zinc-900/70 border-zinc-700/60 shadow-2xl shadow-black/40",
            !isGenerating && input.trim() && "border-red-600/50 shadow-red-950/20"
          )}
        >
          {/* Attachment button */}
          <button
            type="button"
            className="absolute left-4 bottom-3 p-1.5 rounded-full text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 transition-colors"
            title="Attach file"
          >
            <Paperclip className="w-[18px] h-[18px]" />
          </button>

          {/* Auto-growing textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message HackerAI..."
            rows={1}
            disabled={disabled}
            className="flex-1 resize-none bg-transparent border-0 pl-12 pr-14 py-3.5 text-[15px] text-zinc-100 placeholder:text-zinc-600 focus:outline-none max-h-[200px] leading-relaxed"
            style={{ minHeight: "52px" }}
          />

          {/* Send / Stop button */}
          <div className="absolute right-3 bottom-3">
            <AnimatePresence mode="wait" initial={false}>
              {isGenerating ? (
                <motion.button
                  key="stop"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  onClick={onStop}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/50"
                  title="Stop generating"
                >
                  <Square className="w-4 h-4 fill-current" />
                </motion.button>
              ) : (
                <motion.button
                  key="send"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  onClick={() => onSend()}
                  disabled={!input.trim()}
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200",
                    input.trim()
                      ? "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/50 hover:scale-105"
                      : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                  )}
                  title="Send message"
                >
                  {input.trim() ? <ArrowUp className="w-[18px] h-[18px]" /> : <Sparkles className="w-4 h-4" />}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <p className="text-[11px] text-zinc-600 mt-2 text-center">
          HackerAI can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}