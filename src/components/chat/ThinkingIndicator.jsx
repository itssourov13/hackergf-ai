import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Search, FileText, Lightbulb, Code2, CheckCircle2 } from "lucide-react";

const THINKING_STEPS = [
  { label: "Analyzing request", icon: Brain },
  { label: "Searching documentation", icon: Search },
  { label: "Reading context", icon: FileText },
  { label: "Planning response", icon: Lightbulb },
  { label: "Generating", icon: Code2 },
];

export default function ThinkingIndicator() {
  const [stepIndex, setStepIndex] = useState(0);
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((prev) => {
        setCompleted((c) => (prev < c.length + 1 ? [...c, prev] : c));
        if (prev >= THINKING_STEPS.length - 1) return prev;
        return prev + 1;
      });
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-red-600/20 to-red-900/20 border border-red-600/30 flex items-center justify-center"
      >
        <span className="text-xs font-bold text-red-400">AI</span>
      </motion.div>

      <div className="flex-1 space-y-3">
        {/* Current thinking step */}
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl px-4 py-3 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-2.5"
            >
              {(() => {
                const Icon = THINKING_STEPS[stepIndex].icon;
                return <Icon className="w-4 h-4 text-red-400 animate-pulse" />;
              })()}
              <span className="text-sm text-zinc-300 font-medium">{THINKING_STEPS[stepIndex].label}</span>
              <div className="flex items-center gap-1 ml-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1 h-1 rounded-full bg-red-500"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Progress timeline */}
          <div className="mt-3 flex items-center gap-1.5">
            {THINKING_STEPS.map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 rounded-full overflow-hidden bg-zinc-800"
              >
                {i < stepIndex ? (
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    className="h-full bg-green-500/60"
                  />
                ) : i === stepIndex ? (
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.2, ease: "easeInOut" }}
                    className="h-full bg-red-500/70"
                  />
                ) : null}
              </div>
            ))}
          </div>

          {/* Completed steps */}
          <div className="mt-2 space-y-1">
            {completed.slice(0, -1).map((idx) => {
              if (idx === stepIndex) return null;
              const Icon = THINKING_STEPS[idx].icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex items-center gap-2 text-xs text-zinc-600"
                >
                  <CheckCircle2 className="w-3 h-3 text-green-600" />
                  <span>{THINKING_STEPS[idx].label}</span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Shimmer skeleton */}
        <div className="space-y-2 px-1">
          <ShimmerLine width="80%" />
          <ShimmerLine width="60%" />
          <ShimmerLine width="70%" />
        </div>
      </div>
    </div>
  );
}

function ShimmerLine({ width }) {
  return (
    <div
      className="h-3 rounded-full bg-gradient-to-r from-zinc-800 via-zinc-700 to-zinc-800 bg-[length:200%_100%]"
      style={{ width, animation: "shimmer 1.5s infinite linear" }}
    />
  );
}