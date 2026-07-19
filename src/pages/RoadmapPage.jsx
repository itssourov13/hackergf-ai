import React from "react";
import { Card, CardContent } from "@/components/ui/card-custom";
import { Badge } from "@/components/ui/badge-custom";
import { Map, CheckCircle2, Loader2, Sparkles, ArrowRight } from "lucide-react";

const ROADMAP = [
  {
    phase: "In Progress",
    icon: Loader2,
    iconColor: "text-yellow-400",
    bgColor: "bg-yellow-950/40",
    items: [
      { title: "Real-time AI Streaming", description: "Token-by-token streaming responses for a more interactive chat experience.", category: "AI", status: "in_progress" },
      { title: "Collaborative Code Editor", description: "Real-time multi-user editing with shared cursors and live presence.", category: "Editor", status: "in_progress" },
      { title: "Advanced File Processing", description: "Support for PDF, DOCX, and image extraction with AI-powered analysis.", category: "Files", status: "in_progress" },
    ],
  },
  {
    phase: "Planned",
    icon: Sparkles,
    iconColor: "text-blue-400",
    bgColor: "bg-blue-950/40",
    items: [
      { title: "Custom AI Agents", description: "Build and deploy specialized AI agents for automated workflows.", category: "AI", status: "planned" },
      { title: "Git Integration", description: "Connect repositories for seamless version control and PR reviews.", category: "Integrations", status: "planned" },
      { title: "Team Workspaces", description: "Shared projects, chats, and snippets with role-based permissions.", category: "Platform", status: "planned" },
      { title: "Mobile App", description: "Native iOS and Android apps with full platform parity.", category: "Platform", status: "planned" },
    ],
  },
  {
    phase: "Future",
    icon: ArrowRight,
    iconColor: "text-zinc-400",
    bgColor: "bg-zinc-800/60",
    items: [
      { title: "AI-Powered Code Review", description: "Automated PR reviews with security analysis and best practice suggestions.", category: "AI", status: "future" },
      { title: "Terminal Automation", description: "Execute shell commands remotely with AI-assisted scripting.", category: "Developer", status: "future" },
      { title: "Marketplace", description: "Community-driven templates, snippets, and custom AI agents.", category: "Platform", status: "future" },
      { title: "On-Premise Deployment", description: "Self-hosted enterprise edition with SSO and custom model support.", category: "Enterprise", status: "future" },
    ],
  },
];

const COMPLETED = [
  { title: "AI Chat with Zoya", date: "Q1 2026" },
  { title: "Code Editor with Syntax Highlighting", date: "Q1 2026" },
  { title: "File Upload & Storage", date: "Q2 2026" },
  { title: "Usage Analytics & Billing", date: "Q2 2026" },
  { title: "API Keys & Developer Tools", date: "Q2 2026" },
  { title: "Feedback Portal & Roadmap", date: "Q3 2026" },
];

const STATUS_BADGE = {
  in_progress: { label: "In Progress", variant: "warning" },
  planned: { label: "Planned", variant: "default" },
  future: { label: "Future", variant: "secondary" },
};

export default function RoadmapPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-red-600/10 border border-red-600/30">
          <Map className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Product Roadmap</h1>
          <p className="text-sm text-zinc-500">Upcoming features and development milestones for the Hacker gf platform.</p>
        </div>
      </div>

      {/* Roadmap columns */}
      <div className="space-y-8 mb-10">
        {ROADMAP.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.phase}>
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-1.5 rounded-lg ${section.bgColor}`}>
                  <Icon className={`w-4 h-4 ${section.iconColor} ${section.phase === "In Progress" ? "animate-spin" : ""}`} />
                </div>
                <h2 className="text-sm font-semibold text-white uppercase tracking-wide">{section.phase}</h2>
                <span className="text-xs text-zinc-600">({section.items.length})</span>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {section.items.map((item) => {
                  const badge = STATUS_BADGE[item.status];
                  return (
                    <Card key={item.title}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-medium text-red-400">{item.category}</span>
                          <Badge variant={badge.variant}>{badge.label}</Badge>
                        </div>
                        <p className="text-sm font-semibold text-white mb-1">{item.title}</p>
                        <p className="text-xs text-zinc-500 leading-relaxed">{item.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completed */}
      <div className="flex items-center gap-2 mb-3">
        <div className="p-1.5 rounded-lg bg-green-950/40">
          <CheckCircle2 className="w-4 h-4 text-green-500" />
        </div>
        <h2 className="text-sm font-semibold text-white uppercase tracking-wide">Recently Shipped</h2>
      </div>
      <div className="space-y-1.5">
        {COMPLETED.map((item) => (
          <Card key={item.title}>
            <CardContent className="p-3 flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-sm text-white flex-1">{item.title}</span>
              <Badge variant="success">{item.date}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}