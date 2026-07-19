import React from "react";
import { motion } from "framer-motion";
import { Code2, Bug, BookOpen, Zap } from "lucide-react";
import HackerAILogo from "./HackerAILogo";

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
        className="mb-6"
      >
        <HackerAILogo size="xl" withGlow />
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
              type="button"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              whileHover={{ scale: 1.02 }}
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