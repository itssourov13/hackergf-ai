import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Square, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import AttachmentBottomSheet from "./AttachmentBottomSheet";
import AttachmentPreview from "./AttachmentPreview";

export default function ChatInputBar({ input, setInput, onSend, onStop, isGenerating, disabled, attachments, onAddAttachments, onRemoveAttachment }) {
  const textareaRef = useRef(null);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 200) + "px";
  }, [input]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating && input.trim()) onSend();
    }
  };

  const hasInput = input.trim();

  return (
    <div className="px-4 pb-4 pt-2">
      <div className="mx-auto max-w-3xl">
        <AttachmentPreview attachments={attachments} onRemove={onRemoveAttachment} />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          className={cn(
            "relative flex items-end gap-2 rounded-[28px] border backdrop-blur-xl transition-all duration-300",
            "bg-zinc-900/70 border-zinc-700/60 shadow-2xl shadow-black/40 pl-3 pr-3",
            !isGenerating && hasInput && "border-red-600/50 shadow-red-950/20"
          )}
        >
          {/* Circular + button */}
          <div className="pb-3 pt-3">
            <motion.button
              type="button"
              whileTap={{ scale: 0.85, rotate: 90 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => setBottomSheetOpen(true)}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors border border-zinc-700"
              title="Add attachment"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Auto-growing textarea */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Hacker gf..."
            rows={1}
            disabled={disabled}
            className="flex-1 resize-none bg-transparent border-0 py-3.5 text-[15px] text-zinc-100 placeholder:text-zinc-600 focus:outline-none max-h-[200px] leading-relaxed"
            style={{ minHeight: "52px" }}
          />

          {/* Send / Stop button */}
          <div className="pb-3 pt-3">
            <AnimatePresence mode="wait" initial={false}>
              {isGenerating ? (
                <motion.button
                  key="stop"
                  type="button"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  onClick={onStop}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/50"
                  title="Stop generating"
                >
                  <Square className="w-3.5 h-3.5 fill-current" />
                </motion.button>
              ) : (
                <motion.button
                  key="send"
                  type="button"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  whileHover={hasInput ? { scale: 1.1 } : {}}
                  whileTap={hasInput ? { scale: 0.85 } : {}}
                  onClick={() => onSend()}
                  disabled={!hasInput}
                  className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200",
                    hasInput
                      ? "bg-gradient-to-br from-red-500 to-red-700 text-white shadow-lg shadow-red-900/50"
                      : "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                  )}
                  title="Send message"
                >
                  <ArrowUp className="w-[18px] h-[18px]" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <p className="text-[11px] text-zinc-600 mt-2 text-center">
          Hacker gf can make mistakes. Verify important information.
        </p>
      </div>

      <AttachmentBottomSheet
        open={bottomSheetOpen}
        onClose={() => setBottomSheetOpen(false)}
        onSelect={onAddAttachments}
      />
    </div>
  );
}