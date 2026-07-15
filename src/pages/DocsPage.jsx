import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card-custom";
import { Badge } from "@/components/ui/badge-custom";
import { BookOpen, ChevronDown, ChevronRight, MessageSquare, Code2, Upload, Key, CreditCard, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

const GUIDES = [
  {
    id: "getting-started",
    title: "Getting Started with HackerAI",
    icon: Rocket,
    badge: "Beginner",
    content: `Welcome to HackerAI! Here's how to get started:

1. **Create an account** — Sign up and verify your email.
2. **Explore the Dashboard** — Get an overview of your usage and projects.
3. **Start a Chat** — Ask the AI anything about code.
4. **Open the Editor** — Write, edit, and execute code in the built-in editor.
5. **Upload Files** — Share files with the AI for analysis.

Your free plan includes 100 AI messages, 50 file uploads, and 25 code executions per month.`,
  },
  {
    id: "ai-chat",
    title: "Using the AI Chat Effectively",
    icon: MessageSquare,
    badge: "Beginner",
    content: `The AI Chat is your primary interface for interacting with HackerAI.

**Tips for better results:**
- Be specific — include language, framework, and error messages.
- Use markdown — format your questions with code blocks for better context.
- Reference files — upload relevant files before asking questions.
- Choose the right model — use faster models for quick questions, premium models for complex tasks.

**Chat features:**
- Conversations are saved automatically.
- You can switch models mid-conversation.
- Code blocks in responses can be copied with one click.
- Use the stop button to cancel long-running responses.`,
  },
  {
    id: "code-editor",
    title: "Mastering the Code Editor",
    icon: Code2,
    badge: "Intermediate",
    content: `The built-in code editor supports JavaScript and TypeScript execution.

**Key features:**
- **Project management** — Create and switch between multiple projects.
- **File tabs** — Work with multiple files simultaneously.
- **Terminal output** — Execute code and see results in real time.
- **Syntax highlighting** — Full language support with themes.

**Supported execution:**
- JavaScript (sandboxed)
- TypeScript (transpiled to JS)
- JSON validation
- HTML syntax checking

**Keyboard shortcuts:**
- Tab key inserts 2 spaces for indentation.
- Ctrl+S saves your project.
- Settings like font size and word wrap can be configured.`,
  },
  {
    id: "file-upload",
    title: "File Upload & Analysis",
    icon: Upload,
    badge: "Beginner",
    content: `Upload files for the AI to analyze and reference during conversations.

**Supported formats:** PDF, DOCX, TXT, JSON, CSV, images, and code files.

**How it works:**
1. Navigate to the Files page.
2. Drag and drop or select files to upload.
3. The AI automatically extracts text content from documents.
4. Reference uploaded files in your chat conversations.

**Storage limits by plan:**
- Free: 100 MB
- Pro: 5 GB
- Team: 50 GB
- Enterprise: Unlimited`,
  },
  {
    id: "api-keys",
    title: "API Keys & Programmatic Access",
    icon: Key,
    badge: "Advanced",
    content: `Use API keys to access HackerAI programmatically from your applications.

**Creating a key:**
1. Go to the API Keys page.
2. Click "Generate New Key."
3. Name your key (e.g., "Production").
4. Copy the key immediately — it's shown only once.

**Using your key:**
Include it in the Authorization header of your API requests:
\`\`\`
Authorization: Bearer hkai_your_key_here
\`\`\`

**Security best practices:**
- Never commit keys to version control.
- Use environment variables to store keys.
- Revoke keys immediately if compromised.
- Use separate keys for different environments.`,
  },
  {
    id: "billing",
    title: "Billing & Subscription Plans",
    icon: CreditCard,
    badge: "Beginner",
    content: `HackerAI offers four subscription plans:

**Free** — Perfect for trying out the platform.
- 100 AI messages/month
- 50 file uploads
- 25 code executions

**Pro** — For individual developers.
- 1,000 AI messages/month
- 500 file uploads
- 200 code executions
- Priority models

**Team** — For small teams.
- 5,000 AI messages/month
- 2,000 file uploads
- 1,000 code executions
- Team collaboration

**Enterprise** — Custom limits and dedicated support.

Upgrade or downgrade anytime from the Billing page. Usage resets at the start of each billing cycle.`,
  },
];

export default function DocsPage() {
  const [expanded, setExpanded] = useState("getting-started");

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-red-600/10 border border-red-600/30"><BookOpen className="w-5 h-5 text-red-400" /></div>
        <div>
          <h1 className="text-xl font-bold text-white">Documentation</h1>
          <p className="text-sm text-zinc-500">Guides and tutorials to help you get the most out of HackerAI.</p>
        </div>
      </div>

      <div className="space-y-2">
        {GUIDES.map((guide) => {
          const Icon = guide.icon;
          const isOpen = expanded === guide.id;
          return (
            <Card key={guide.id} className="overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? null : guide.id)}
                className="w-full p-4 flex items-center gap-3 text-left hover:bg-zinc-900/50 transition-colors"
              >
                <div className="p-2 rounded-lg bg-zinc-800/60 flex-shrink-0"><Icon className="w-5 h-5 text-red-400" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white text-sm">{guide.title}</span>
                    <Badge variant={guide.badge === "Advanced" ? "warning" : guide.badge === "Intermediate" ? "default" : "success"}>{guide.badge}</Badge>
                  </div>
                </div>
                {isOpen ? <ChevronDown className="w-4 h-4 text-zinc-500" /> : <ChevronRight className="w-4 h-4 text-zinc-500" />}
              </button>
              {isOpen && (
                <div className="px-4 pb-4 pl-14">
                  <div className="md-content text-sm text-zinc-400 whitespace-pre-wrap leading-relaxed">
                    {guide.content}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      <div className="mt-8 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
        <p className="text-sm text-zinc-400">Can't find what you're looking for?</p>
        <Link to="/support" className="text-sm text-red-400 hover:text-red-300 font-medium mt-1 inline-block">Contact Support →</Link>
      </div>
    </div>
  );
}