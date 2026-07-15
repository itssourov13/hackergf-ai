import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Code2, Bug, BookOpen, Zap } from "lucide-react";

const SUGGESTIONS = [
  { icon: Code2, text: "Write a React component for a responsive navbar", color: "text-blue-400" },
  { icon: Bug, text: "Debug: TypeError: Cannot read property 'map' of undefined", color: "text-red-400" },
  { icon: BookOpen, text: "Explain async/await vs promises in JavaScript", color: "text-green-400" },
  { icon: Zap, text: "Write a Python function to reverse a linked list", color: "text-yellow-400" },
];

export default function ChatEmptyState({ onPick }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="relative mb-6"
      >
        <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full" />
        <div className="relative flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-red-600/20 to-zinc-900 border border-red-600/30">
          <Sparkles className="w-9 h-9 text-red-400" />
        </div>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-2xl font-bold text-white mb-2"
      >
        How can I help you today?
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="text-sm text-zinc-500 mb-8 text-center max-w-md"
      >
        Ask anything about code, get explanations, debug issues, or generate new code.
      </motion.p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-2xl">
        {SUGGESTIONS.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              whileHover={{ y: -2 }}
              onClick={() => onPick(s.text)}
              className="flex items-center gap-3 text-left p-3.5 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900 transition-colors text-sm text-zinc-300 group"
            >
              <Icon className={`w-4 h-4 ${s.color} flex-shrink-0`} />
              <span className="flex-1">{s.text}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}