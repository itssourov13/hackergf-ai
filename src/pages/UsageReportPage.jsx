import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card-custom";
import { Badge } from "@/components/ui/badge-custom";
import { Loader2, ClipboardList, TrendingUp, MessageSquare, Zap, HardDrive, Code2, FileText, Clock } from "lucide-react";
import { getPlan } from "@/lib/config/plans";
import { getUserUsage } from "@/lib/usage";

export default function UsageReportPage() {
  const [subscription, setSubscription] = useState(null);
  const [usage, setUsage] = useState({});
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subs, usageData, logsData] = await Promise.all([
        base44.entities.Subscription.list(),
        getUserUsage(),
        base44.entities.UsageRecord.filter({}, "-created_date", 30),
      ]);
      setSubscription(subs?.[0] || null);
      setUsage(usageData);
      setLogs(logsData);
    } catch (err) {
      console.error("Failed to load usage data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <Loader2 className="w-5 h-5 text-red-500 animate-spin" />
      </div>
    );
  }

  const plan = getPlan(subscription?.plan);
  const subUsage = subscription?.usage || {};

  const limits = [
    { label: "AI Messages", used: subUsage.ai_messages || usage.ai_messages || 0, limit: plan.limits.aiMessagesPerMonth, icon: MessageSquare, color: "text-red-400" },
    { label: "Tokens Consumed", used: subUsage.tokens_used || usage.tokens || 0, limit: -1, icon: Zap, color: "text-yellow-400" },
    { label: "Storage (MB)", used: subUsage.storage_used_mb || usage.storage || 0, limit: plan.limits.storageMb, icon: HardDrive, color: "text-blue-400" },
    { label: "File Uploads", used: subUsage.file_uploads || usage.file_uploads || 0, limit: plan.limits.fileUploads, icon: FileText, color: "text-green-400" },
    { label: "Code Executions", used: subUsage.code_executions || usage.code_executions || 0, limit: plan.limits.codeExecutions, icon: Code2, color: "text-purple-400" },
    { label: "API Requests", used: subUsage.api_requests || usage.api_requests || 0, limit: -1, icon: TrendingUp, color: "text-cyan-400" },
  ];

  const pct = (used, limit) => {
    if (limit === -1 || limit === 0) return 0;
    return Math.min(100, Math.round((used / limit) * 100));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-red-600/10 border border-red-600/30">
          <ClipboardList className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Usage Report</h1>
          <p className="text-sm text-zinc-500">Detailed breakdown of subscription limits, token consumption, and activity logs.</p>
        </div>
      </div>

      {/* Plan summary */}
      <Card className="mb-6">
        <CardContent className="p-5 flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-500">Current Plan</p>
            <p className="text-lg font-bold text-white capitalize">{plan.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-zinc-500">Status</p>
            <Badge variant={subscription?.status === "active" ? "success" : "warning"}>
              {subscription?.status || "active"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Limits & consumption */}
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">Subscription Limits & Consumption</h2>
      <div className="space-y-3 mb-8">
        {limits.map((item) => {
          const Icon = item.icon;
          const percent = pct(item.used, item.limit);
          return (
            <Card key={item.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-zinc-800/60">
                    <Icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <span className="text-sm font-medium text-white flex-1">{item.label}</span>
                  <span className="text-sm text-zinc-400">
                    {item.used.toLocaleString()}
                    {item.limit === -1 ? " (unlimited)" : ` / ${item.limit.toLocaleString()}`}
                  </span>
                </div>
                {item.limit !== -1 && (
                  <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${percent > 80 ? "bg-red-500" : percent > 50 ? "bg-yellow-500" : "bg-green-500"}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Activity logs */}
      <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wide mb-3">Activity Logs</h2>
      {logs.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center text-sm text-zinc-600">No activity recorded yet.</CardContent>
        </Card>
      ) : (
        <div className="space-y-1.5">
          {logs.map((log) => (
            <Card key={log.id}>
              <CardContent className="p-3 flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-zinc-800/60">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white capitalize truncate">{log.metric?.replace(/_/g, " ")}</p>
                  <p className="text-xs text-zinc-500">
                    {log.period} • {log.value} {log.metric === "tokens" ? "tokens" : "requests"}
                  </p>
                </div>
                <Badge variant="secondary">{log.value}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}