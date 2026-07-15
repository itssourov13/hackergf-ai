import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-custom";
import { Command, MessageSquare, Terminal, FileCode } from "lucide-react";

const SECTIONS = [
  {
    title: "Chat Slash Commands",
    icon: MessageSquare,
    commands: [
      { cmd: "/clear", desc: "Clear the current conversation history" },
      { cmd: "/model <name>", desc: "Switch to a different AI model (e.g. /model gemini_3_flash)" },
      { cmd: "/title <text>", desc: "Rename the current conversation" },
      { cmd: "/summarize", desc: "Generate a summary of the conversation so far" },
      { cmd: "/export", desc: "Export the conversation as markdown" },
      { cmd: "/help", desc: "Show available commands in the chat" },
    ],
  },
  {
    title: "Editor Commands",
    icon: FileCode,
    commands: [
      { cmd: ":new", desc: "Create a new project" },
      { cmd: ":open <name>", desc: "Open an existing project by name" },
      { cmd: ":save", desc: "Save the current project state" },
      { cmd: ":file <name>", desc: "Create a new file in the current project" },
      { cmd: ":rename <old> <new>", desc: "Rename a file in the project" },
      { cmd: ":run", desc: "Execute the current file in the terminal" },
      { cmd: ":lang <language>", desc: "Set the project language (javascript, typescript)" },
      { cmd: ":format", desc: "Format the current file" },
    ],
  },
  {
    title: "Terminal Commands",
    icon: Terminal,
    commands: [
      { cmd: "run", desc: "Execute the currently active file" },
      { cmd: "clear", desc: "Clear the terminal output" },
      { cmd: "help", desc: "Show available terminal commands" },
      { cmd: "echo <text>", desc: "Print text to the terminal output" },
      { cmd: "time", desc: "Display the current execution time" },
      { cmd: "lang", desc: "Show the current project language" },
    ],
  },
];

export default function CommandsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-red-600/10 border border-red-600/30"><Command className="w-5 h-5 text-red-400" /></div>
        <div>
          <h1 className="text-xl font-bold text-white">Quick Commands</h1>
          <p className="text-sm text-zinc-500">Reference for slash commands in chat and terminal shortcuts in the editor.</p>
        </div>
      </div>

      <div className="space-y-4">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Icon className="w-4 h-4 text-red-400" /> {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {section.commands.map((c, i) => (
                    <div key={i} className="flex items-center gap-4 py-2 px-2 rounded-lg hover:bg-zinc-900/50 transition-colors">
                      <code className="px-2.5 py-1 rounded-md bg-zinc-800 border border-zinc-700 text-xs font-mono text-red-400 flex-shrink-0 min-w-[160px]">
                        {c.cmd}
                      </code>
                      <span className="text-sm text-zinc-400">{c.desc}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
        <p className="text-sm text-zinc-400">
          Type <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-red-400 font-mono text-xs">/help</code> in the chat or <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-red-400 font-mono text-xs">help</code> in the terminal for inline command references.
        </p>
      </div>
    </div>
  );
}