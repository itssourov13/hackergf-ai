import React, { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, FileText, Camera, X } from "lucide-react";

export default function AttachmentBottomSheet({ open, onClose, onSelect }) {
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileChange = (e, type) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const attachments = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      type,
      name: file.name,
      size: file.size,
      url: type === "image" ? URL.createObjectURL(file) : null,
      file,
      uploading: true,
    }));

    onSelect(attachments);
    e.target.value = "";
  };

  const options = [
    { icon: ImageIcon, label: "Choose Image", desc: "Select from gallery", color: "text-blue-400", bg: "bg-blue-600/10 border-blue-600/30", onClick: () => imageInputRef.current?.click() },
    { icon: FileText, label: "Upload File", desc: "PDF, DOCX, code & more", color: "text-green-400", bg: "bg-green-600/10 border-green-600/30", onClick: () => fileInputRef.current?.click() },
    { icon: Camera, label: "Camera", desc: "Capture a photo", color: "text-purple-400", bg: "bg-purple-600/10 border-purple-600/30", onClick: () => cameraInputRef.current?.click() },
  ];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed bottom-0 inset-x-0 z-50 bg-zinc-900 border-t border-zinc-800 rounded-t-3xl p-6 pb-8 mx-auto max-w-md"
          >
            <div className="w-10 h-1 bg-zinc-700 rounded-full mx-auto mb-6" />

            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-semibold text-white">Add to conversation</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              {options.map((opt) => {
                const Icon = opt.icon;
                return (
                  <motion.button
                    key={opt.label}
                    whileTap={{ scale: 0.97 }}
                    onClick={opt.onClick}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl border ${opt.bg} hover:scale-[1.02] transition-transform text-left`}
                  >
                    <div className="p-2.5 rounded-xl bg-zinc-900/60">
                      <Icon className={`w-5 h-5 ${opt.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{opt.label}</p>
                      <p className="text-xs text-zinc-500">{opt.desc}</p>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <input ref={imageInputRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleFileChange(e, "image")} />
            <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt,.zip,.json,.csv,.js,.ts,.jsx,.tsx,.py,.html,.css,.md,.sh,.yml,.yaml" multiple hidden onChange={(e) => handleFileChange(e, "file")} />
            <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => handleFileChange(e, "image")} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}