import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-custom";
import { Badge } from "@/components/ui/badge-custom";
import { Keyboard, Code2, Terminal, MessageSquare, Globe } from "lucide-react";

const SECTIONS = [
  {
    title: "Code Editor",
    icon: Code2,
    shortcuts: [
      { keys: ["Tab"], desc: "Insert 2 spaces for indentation" },
      { keys: ["Ctrl", "S"], desc: "Save current project" },
      { keys: ["Ctrl", "Z"], desc: "Undo last change" },
      { keys: ["Ctrl", "Y"], desc: "Redo last undone change" },
      { keys: ["Ctrl", "F"], desc: "Find in current file" },
      { keys: ["Ctrl", "/"], desc: "Toggle line comment" },
      { keys: ["Ctrl", "D"], desc: "Select next occurrence" },
      { keys: ["Alt", "↑/↓"], desc: "Move line up/down" },
    ],
  },
  {
    title: "Terminal",
    icon: Terminal,
    shortcuts: [
      { keys: ["Enter"], desc: "Execute current code" },
      { keys: ["Ctrl", "L"], desc: "Clear terminal output" },
      { keys: ["Ctrl", "C"], desc: "Cancel running execution" },
      { keys: ["↑"], desc: "Previous command in history" },
      { keys: ["↓"], desc: "Next command in history" },
    ],
  },
  {
    title: "AI Chat",
    icon: MessageSquare,
    shortcuts: [
      { keys: ["Enter"], desc: "Send message" },
      { keys: ["Shift", "Enter"], desc: "Insert new line" },
      { keys: ["Esc"], desc: "Stop AI generation" },
      { keys: ["Ctrl", "K"], desc: "Open command palette" },
      { keys: ["Ctrl", "/"], desc: "Open slash commands" },
    ],
  },
  {
    title: "Global",
    icon: Globe,
    shortcuts: [
      { keys: ["Ctrl", "B"], desc: "Toggle sidebar" },
      { keys: ["Ctrl", "P"], desc: "Quick navigate to page" },
      { keys: ["Ctrl", ","], desc: "Open Settings" },
      { keys: ["Ctrl", "K"], desc: "Command palette" },
      { keys: ["?", "⇧"], desc: "Show this shortcuts page" },
    ],
  },
];

export default function ShortcutsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-red-600/10 border border-red-600/30"><Keyboard className="w-5 h-5 text-red-400" /></div>
        <div>
          <h1 className="text-xl font-bold text-white">Keyboard Shortcuts</h1>
          <p className="text-sm text-zinc-500">All available shortcuts for the editor, terminal, and chat.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Icon className="w-4 h-4 text-red-400" /> {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {section.shortcuts.map((sc, i) => (
                  <div key={i} className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-zinc-900/50 transition-colors">
                    <span className="text-sm text-zinc-400">{sc.desc}</span>
                    <div className="flex items-center gap-1">
                      {sc.keys.map((key, j) => (
                        <React.Fragment key={j}>
                          {j > 0 && <span className="text-zinc-600 text-xs">+</span>}
                          <kbd className="px-2 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-xs font-mono text-zinc-300 shadow-sm">{key}</kbd>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}