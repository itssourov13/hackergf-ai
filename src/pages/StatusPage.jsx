import React from "react";
import { Card, CardContent } from "@/components/ui/card-custom";
import { Badge } from "@/components/ui/badge-custom";
import { Activity, CheckCircle2, Server, Database, Cloud, Cpu, Clock } from "lucide-react";

const SERVICES = [
  { name: "AI Chat API", status: "operational", uptime: "99.98%", latency: "120ms", icon: Server },
  { name: "Code Execution Engine", status: "operational", uptime: "99.95%", latency: "45ms", icon: Cpu },
  { name: "File Storage", status: "operational", uptime: "100%", latency: "30ms", icon: Cloud },
  { name: "Database", status: "operational", uptime: "99.99%", latency: "12ms", icon: Database },
];

const MODELS = [
  { name: "Automatic", provider: "Auto-routed", status: "operational", latency: "~1.0s" },
  { name: "GPT-5 Mini", provider: "OpenAI", status: "operational", latency: "0.8s" },
  { name: "Gemini 3 Flash", provider: "Google", status: "operational", latency: "0.6s" },
  { name: "GPT-5.4", provider: "OpenAI", status: "operational", latency: "1.5s" },
  { name: "Claude Sonnet 4.6", provider: "Anthropic", status: "operational", latency: "1.8s" },
  { name: "Claude Opus 4.8", provider: "Anthropic", status: "degraded", latency: "3.2s" },
];

const INCIDENTS = [
  { date: "Jul 10, 2026", title: "Brief API latency increase", status: "resolved", duration: "12 min" },
  { date: "Jun 28, 2026", title: "Scheduled maintenance — file storage", status: "resolved", duration: "45 min" },
];

export default function StatusPage() {
  const allOperational = MODELS.every((m) => m.status === "operational");

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-red-600/10 border border-red-600/30"><Activity className="w-5 h-5 text-red-400" /></div>
        <div>
          <h1 className="text-xl font-bold text-white">System Status</h1>
          <p className="text-sm text-zinc-500">Real-time operational health of AI models and core services.</p>
        </div>
      </div>

      {/* Overall status banner */}
      <Card className={`mb-6 ${allOperational ? "border-green-900/40" : "border-yellow-900/40"}`}>
        <CardContent className="p-5 flex items-center gap-3">
          <div className={`p-3 rounded-full ${allOperational ? "bg-green-950/60" : "bg-yellow-950/60"}`}>
            <CheckCircle2 className={`w-6 h-6 ${allOperational ? "text-green-400" : "text-yellow-400"}`} />
          </div>
          <div>
            <p className={`font-semibold ${allOperational ? "text-green-400" : "text-yellow-400"}`}>
              {allOperational ? "All Systems Operational" : "Partial Degradation"}
            </p>
            <p className="text-sm text-zinc-500">Last updated: {new Date().toLocaleTimeString()}</p>
          </div>
        </CardContent>
      </Card>

      {/* Core services */}
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">Core Services</h2>
      <div className="space-y-2 mb-8">
        {SERVICES.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.name}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-zinc-800/60"><Icon className="w-4 h-4 text-zinc-400" /></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{s.name}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-zinc-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {s.latency}</span>
                    <span>Uptime: {s.uptime}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <Badge variant="success">Operational</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* AI Models */}
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">AI Model Availability</h2>
      <div className="space-y-2 mb-8">
        {MODELS.map((m) => (
          <Card key={m.name}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-zinc-800/60"><Cpu className="w-4 h-4 text-zinc-400" /></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{m.name}</p>
                <p className="text-xs text-zinc-500">{m.provider} • {m.latency}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${m.status === "operational" ? "bg-green-500 animate-pulse" : "bg-yellow-500 animate-pulse"}`} />
                <Badge variant={m.status === "operational" ? "success" : "warning"}>
                  {m.status === "operational" ? "Operational" : "Degraded"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent incidents */}
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">Recent Incidents</h2>
      <div className="space-y-2">
        {INCIDENTS.map((inc, i) => (
          <Card key={i}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-950/40"><CheckCircle2 className="w-4 h-4 text-green-500" /></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{inc.title}</p>
                <p className="text-xs text-zinc-500">{inc.date} • {inc.duration}</p>
              </div>
              <Badge variant="success">Resolved</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}