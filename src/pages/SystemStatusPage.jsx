import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card-custom";
import { Badge } from "@/components/ui/badge-custom";
import { Button } from "@/components/ui/button-custom";
import { Server, Cpu, Cloud, Database, Clock, RefreshCw, CheckCircle2, AlertTriangle, Zap, Globe } from "lucide-react";

const SERVICES = [
  { name: "AI Chat API", status: "operational", uptime: "99.98%", latency: "120ms", region: "us-east-1", icon: Server },
  { name: "Code Execution Engine", status: "operational", uptime: "99.95%", latency: "45ms", region: "us-east-1", icon: Cpu },
  { name: "File Storage", status: "operational", uptime: "100%", latency: "30ms", region: "global", icon: Cloud },
  { name: "Database Cluster", status: "operational", uptime: "99.99%", latency: "12ms", region: "us-east-1", icon: Database },
  { name: "Authentication Service", status: "operational", uptime: "99.97%", latency: "18ms", region: "global", icon: Zap },
];

const MODELS = [
  { name: "Automatic", provider: "Auto-routed", status: "operational", latency: "~1.0s" },
  { name: "GPT-5 Mini", provider: "OpenAI", status: "operational", latency: "0.8s" },
  { name: "Gemini 3 Flash", provider: "Google", status: "operational", latency: "0.6s" },
  { name: "GPT-5.4", provider: "OpenAI", status: "operational", latency: "1.5s" },
  { name: "GPT-5.5", provider: "OpenAI", status: "operational", latency: "1.4s" },
  { name: "Claude Sonnet 4.6", provider: "Anthropic", status: "operational", latency: "1.8s" },
  { name: "Claude Opus 4.6", provider: "Anthropic", status: "operational", latency: "2.5s" },
  { name: "Claude Opus 4.7", provider: "Anthropic", status: "degraded", latency: "3.1s" },
  { name: "Claude Opus 4.8", provider: "Anthropic", status: "degraded", latency: "3.2s" },
];

const INCIDENTS = [
  { date: "Jul 15, 2026", title: "Claude Opus 4.7/4.8 elevated latency", status: "monitoring", duration: "ongoing" },
  { date: "Jul 10, 2026", title: "Brief API latency increase", status: "resolved", duration: "12 min" },
  { date: "Jun 28, 2026", title: "Scheduled maintenance — file storage", status: "resolved", duration: "45 min" },
  { date: "Jun 15, 2026", title: "Database connection pool exhaustion", status: "resolved", duration: "8 min" },
];

const STATUS_META = {
  operational: { label: "Operational", badge: "success", dot: "bg-green-500" },
  degraded: { label: "Degraded", badge: "warning", dot: "bg-yellow-500" },
  monitoring: { label: "Monitoring", badge: "warning", dot: "bg-yellow-500" },
  resolved: { label: "Resolved", badge: "success", dot: "bg-green-500" },
};

export default function SystemStatusPage() {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  const allOperational = MODELS.every((m) => m.status === "operational") && SERVICES.every((s) => s.status === "operational");

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setRefreshing(false);
    }, 800);
  };

  useEffect(() => {
    const interval = setInterval(() => setLastUpdated(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-600/10 border border-red-600/30">
            <Globe className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">System Status</h1>
            <p className="text-sm text-zinc-500">Live availability of AI models and core services.</p>
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={handleRefresh} disabled={refreshing}>
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Overall status banner */}
      <Card className={`mb-6 ${allOperational ? "border-green-900/40" : "border-yellow-900/40"}`}>
        <CardContent className="p-5 flex items-center gap-3">
          <div className={`p-3 rounded-full ${allOperational ? "bg-green-950/60" : "bg-yellow-950/60"}`}>
            {allOperational ? <CheckCircle2 className="w-6 h-6 text-green-400" /> : <AlertTriangle className="w-6 h-6 text-yellow-400" />}
          </div>
          <div className="flex-1">
            <p className={`font-semibold ${allOperational ? "text-green-400" : "text-yellow-400"}`}>
              {allOperational ? "All Systems Operational" : "Partial Degradation"}
            </p>
            <p className="text-sm text-zinc-500">Last updated: {lastUpdated.toLocaleTimeString()}</p>
          </div>
        </CardContent>
      </Card>

      {/* Core services */}
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">Core Services</h2>
      <div className="space-y-2 mb-8">
        {SERVICES.map((s) => {
          const Icon = s.icon;
          const meta = STATUS_META[s.status];
          return (
            <Card key={s.name}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-zinc-800/60"><Icon className="w-4 h-4 text-zinc-400" /></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{s.name}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-zinc-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {s.latency}</span>
                    <span>Uptime: {s.uptime}</span>
                    <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {s.region}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${meta.dot} animate-pulse`} />
                  <Badge variant={meta.badge}>{meta.label}</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* AI Models */}
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">AI Model Availability</h2>
      <div className="space-y-2 mb-8">
        {MODELS.map((m) => {
          const meta = STATUS_META[m.status];
          return (
            <Card key={m.name}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-zinc-800/60"><Cpu className="w-4 h-4 text-zinc-400" /></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{m.name}</p>
                  <p className="text-xs text-zinc-500">{m.provider} • Avg response: {m.latency}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${meta.dot} animate-pulse`} />
                  <Badge variant={meta.badge}>{meta.label}</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Incidents */}
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">Recent Incidents</h2>
      <div className="space-y-2">
        {INCIDENTS.map((inc, i) => {
          const meta = STATUS_META[inc.status];
          return (
            <Card key={i}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${inc.status === "resolved" ? "bg-green-950/40" : "bg-yellow-950/40"}`}>
                  {inc.status === "resolved" ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{inc.title}</p>
                  <p className="text-xs text-zinc-500">{inc.date} • {inc.duration}</p>
                </div>
                <Badge variant={meta.badge}>{meta.label}</Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}