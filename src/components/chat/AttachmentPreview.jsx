import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, FileText, Loader2 } from "lucide-react";

export default function AttachmentPreview({ attachments, onRemove }) {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-2 px-1">
      <AnimatePresence>
        {attachments.map((att) => (
          <motion.div
            key={att.id}
            initial={{ opacity: 0, scale: 0.8, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative"
          >
            {att.type === "image" ? (
              <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900">
                <img src={att.url} alt={att.name} className="w-full h-full object-cover" />
                {att.uploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Loader2 className="w-5 h-5 text-red-400 animate-spin" />
                  </div>
                )}
              </div>
            ) : (
              <div className="relative flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-xl bg-zinc-800/80 border border-zinc-700 max-w-[200px]">
                <div className="p-1.5 rounded-lg bg-zinc-900/60">
                  <FileText className="w-4 h-4 text-zinc-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-white truncate">{att.name}</p>
                  <p className="text-[10px] text-zinc-500">{formatSize(att.size)}</p>
                </div>
                {att.uploading && <Loader2 className="w-3 h-3 text-zinc-500 animate-spin flex-shrink-0" />}
              </div>
            )}
            <button
              onClick={() => onRemove(att.id)}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-red-600 transition-colors shadow-lg"
            >
              <X className="w-3 h-3" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}