import React from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";

export default function HackerAILogo({ size = "md", withGlow = false }) {
  const sizes = {
    sm: { box: "w-8 h-8", icon: "w-4 h-4", rounded: "rounded-lg" },
    md: { box: "w-10 h-10", icon: "w-5 h-5", rounded: "rounded-xl" },
    lg: { box: "w-16 h-16", icon: "w-7 h-7", rounded: "rounded-2xl" },
    xl: { box: "w-20 h-20", icon: "w-9 h-9", rounded: "rounded-3xl" },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className="relative flex items-center justify-center">
      {withGlow && (
        <>
          <motion.div
            className={`absolute ${s.box} ${s.rounded} bg-red-500/30 blur-2xl`}
            animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.15, 0.9] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className={`absolute ${s.box} ${s.rounded} bg-red-500/10 blur-xl`}
            animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}
      <motion.div
        className={`relative ${s.box} ${s.rounded} bg-gradient-to-br from-red-600/20 via-red-900/10 to-zinc-900 border border-red-600/30 flex items-center justify-center`}
        animate={withGlow ? { borderColor: ["rgba(239,68,68,0.3)", "rgba(239,68,68,0.5)", "rgba(239,68,68,0.3)"] } : {}}
        transition={withGlow ? { duration: 3, repeat: Infinity, ease: "easeInOut" } : {}}
      >
        <Terminal className={`${s.icon} text-red-400`} />
      </motion.div>
    </div>
  );
}