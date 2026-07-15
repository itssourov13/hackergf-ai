import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-custom";
import { Badge } from "@/components/ui/badge-custom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button-custom";
import { Gauge, MessageSquare, Coins, Upload, Code2, Database, Loader2, TrendingUp } from "lucide-react";
import { getPlan } from "@/lib/config/plans";

const METRICS = [
  { key: "ai_messages", label: "AI Messages", icon: MessageSquare, color: "text-red-400", barColor: "bg-red-500" },
  { key: "tokens", label: "Tokens Used", icon: Coins, color: "text-yellow-400", barColor: "bg-yellow-500" },
  { key: "file_uploads", label: "File Uploads", icon: Upload, color: "text-green-400", barColor: "bg-green-500" },
  { key: "code_executions", label: "Code Executions", icon: Code2, color: "text-blue-400", barColor: "bg-blue-500" },
  { key: "storage_used_mb", label: "Storage (MB)", icon: Database, color: "text-purple-400", barColor: "bg-purple-500" },
  { key: "api_requests", label: "API Requests", icon: TrendingUp, color: "text-orange-400", barColor: "bg-orange-500" },
];

export default function QuotasPage() {
  const { toast } = useToast();
  const [subscription, setSubscription] = useState(null);
  const [usage, setUsage] = useState({ ai_messages: 0, tokens: 0, file_uploads: 0, code_executions: 0, storage_used_mb: 0, api_requests: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const subs = await base44.entities.Subscription.filter({ status: "active" }, "-created_date", 1);
      if (subs.length > 0) {
        setSubscription(subs[0]);
        setUsage(subs[0].usage || {});
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const planId = subscription?.plan || "free";
  const plan = getPlan(planId);
  const limits = plan?.limits || { ai_messages: 100, tokens: 50000, file_uploads: 50, code_executions: 25, storage_mb: 100, api_requests: 500 };

  const getLimit = (key) => {
    if (key === "storage_used_mb") return limits.storage_mb || limits.storage_used_mb || 100;
    return limits[key] || 0;
  };

  const getPercentage = (used, limit) => (limit > 0 ? Math.min(100, (used / limit) * 100) : 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-red-600/10 border border-red-600/30"><Gauge className="w-5 h-5 text-red-400" /></div>
        <div>
          <h1 className="text-xl font-bold text-white">Usage Quotas</h1>
          <p className="text-sm text-zinc-500">Track your subscription usage against your plan limits.</p>
        </div>
      </div>

      {/* Plan banner */}
      <Card className="mb-6">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-red-600/20 to-zinc-900 border border-red-600/30">
              <Gauge className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold text-white capitalize">{plan?.name || "Free"}</p>
                <Badge variant={subscription?.status === "active" ? "success" : "warning"}>{subscription?.status || "active"}</Badge>
              </div>
              <p className="text-sm text-zinc-500">{plan?.description || "Free tier with basic limits"}</p>
            </div>
          </div>
          <Button onClick={() => window.location.href = "/billing"} className="bg-red-600 hover:bg-red-500">Upgrade Plan</Button>
        </CardContent>
      </Card>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-zinc-600 animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          {METRICS.map((m) => {
            const Icon = m.icon;
            const used = usage[m.key] || 0;
            const limit = getLimit(m.key);
            const pct = getPercentage(used, limit);
            return (
              <Card key={m.key}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-zinc-800/60"><Icon className={`w-4 h-4 ${m.color}`} /></div>
                      <span className="text-sm font-medium text-white">{m.label}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-semibold text-white">{used.toLocaleString()}</span>
                      <span className="text-zinc-500"> / {limit.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="h-2.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${pct > 80 ? "bg-red-500" : m.barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-zinc-600 mt-1.5">
                    {pct.toFixed(1)}% used {pct > 80 && <span className="text-red-400">• Approaching limit</span>}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <p className="text-xs text-zinc-600 mt-6 text-center">Usage resets at the beginning of each billing cycle.</p>
    </div>
  );
}