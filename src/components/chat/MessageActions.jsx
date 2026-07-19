import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ThumbsUp, ThumbsDown, Copy, Check, Share2, MoreHorizontal,
  FileCode, FileText, RefreshCw, CornerDownRight, Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function MessageActions({ msg, liked, disliked, onLike, onDislike, onShare, onRegenerate, onContinue, onDelete }) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: "Hacker gf Response", text: msg.content }); } catch (e) {}
    } else {
      navigator.clipboard.writeText(msg.content);
    }
    onShare?.();
  };

  const moreItems = [
    { label: "Copy as Markdown", icon: FileCode, action: () => navigator.clipboard.writeText(msg.content) },
    { label: "Copy as Plain Text", icon: FileText, action: () => navigator.clipboard.writeText(stripMarkdown(msg.content)) },
    { label: "Regenerate Response", icon: RefreshCw, action: () => onRegenerate?.(msg) },
    { label: "Continue Response", icon: CornerDownRight, action: () => onContinue?.(msg) },
    { label: "Delete Response", icon: Trash2, action: () => onDelete?.(msg.id), danger: true },
  ];

  return (
    <div className="flex items-center gap-0.5 mt-2 -ml-1.5">
      <ActionBtn active={liked} onClick={() => onLike?.(msg.id)}><ThumbsUp className="w-3.5 h-3.5" /></ActionBtn>
      <ActionBtn active={disliked} onClick={() => onDislike?.(msg.id)}><ThumbsDown className="w-3.5 h-3.5" /></ActionBtn>
      <ActionBtn onClick={handleCopy} active={copied}>
        {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
      </ActionBtn>
      <ActionBtn onClick={handleShare}><Share2 className="w-3.5 h-3.5" /></ActionBtn>
      <div className="relative">
        <ActionBtn onClick={() => setMoreOpen(!moreOpen)} active={moreOpen}><MoreHorizontal className="w-3.5 h-3.5" /></ActionBtn>
        {moreOpen && <div className="fixed inset-0 z-10" onClick={() => setMoreOpen(false)} />}
        <AnimatePresence>
          {moreOpen && (
            <motion.div
              key="more-menu"
              initial={{ opacity: 0, y: -5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -5, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 top-full mt-1 w-52 rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl z-20 overflow-hidden"
            >
              {moreItems.map((item, i) => (
                <button
                  key={i}
                  onClick={() => { item.action(); setMoreOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2.5 text-sm hover:bg-zinc-800 transition-colors text-left",
                    item.danger ? "text-red-400 hover:bg-red-950/40" : "text-zinc-300"
                  )}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ActionBtn({ children, onClick, active }) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.85 }}
      onClick={onClick}
      className={cn(
        "flex items-center justify-center w-7 h-7 rounded-lg transition-colors",
        active ? "text-red-400 bg-red-950/40" : "text-zinc-600 hover:text-zinc-300 hover:bg-zinc-800/60"
      )}
    >
      {children}
    </motion.button>
  );
}

function stripMarkdown(text) {
  return text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/~~([^~]+)~~/g, "$1")
    .replace(/#{1,6}\s/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^>\s/gm, "")
    .replace(/^[-*+]\s/gm, "")
    .trim();
}