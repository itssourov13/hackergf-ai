import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-custom";
import { Badge } from "@/components/ui/badge-custom";
import { BarChart3, MessageSquare, Coins, Upload, Code2, TrendingUp } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const CHART_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#a855f7"];

export default function AnalyticsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.UsageRecord.list("-created_date", 200)
      .then(setRecords)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const summary = {
    ai_message: 0, tokens: 0, file_upload: 0, code_execution: 0, storage: 0, api_request: 0,
  };
  records.forEach((r) => { summary[r.metric] = (summary[r.metric] || 0) + (r.value || 0); });

  const byPeriod = {};
  records.forEach((r) => {
    const p = r.period || "unknown";
    if (!byPeriod[p]) byPeriod[p] = { period: p, ai_message: 0, tokens: 0, file_upload: 0, code_execution: 0, api_request: 0 };
    byPeriod[p][r.metric] = (byPeriod[p][r.metric] || 0) + (r.value || 0);
  });
  const timeData = Object.values(byPeriod).sort((a, b) => a.period.localeCompare(b.period));

  const barData = Object.entries(summary)
    .filter(([, v]) => v > 0)
    .map(([metric, value]) => ({ metric: metric.replace(/_/g, " "), value }));

  const pieData = barData;
  const statCards = [
    { label: "AI Messages", value: summary.ai_message, icon: MessageSquare, color: "text-red-400" },
    { label: "Tokens Used", value: summary.tokens, icon: Coins, color: "text-yellow-400" },
    { label: "File Uploads", value: summary.file_upload, icon: Upload, color: "text-green-400" },
    { label: "Code Executions", value: summary.code_execution, icon: Code2, color: "text-blue-400" },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <PageHeader icon={BarChart3} title="Usage Analytics" desc="Track your token consumption, API usage, and activity trends over time." />

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-zinc-800/60"><Icon className={`w-5 h-5 ${s.color}`} /></div>
                <div>
                  <p className="text-2xl font-bold text-white">{s.value.toLocaleString()}</p>
                  <p className="text-xs text-zinc-500">{s.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-zinc-700 border-t-red-500 rounded-full animate-spin" /></div>
      ) : records.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-6">
          {/* Line chart */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-sm"><TrendingUp className="w-4 h-4 text-red-400" /> Usage Over Time</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 15%)" />
                  <XAxis dataKey="period" stroke="hsl(0 0% 40%)" fontSize={12} />
                  <YAxis stroke="hsl(0 0% 40%)" fontSize={12} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line type="monotone" dataKey="ai_message" stroke="#ef4444" strokeWidth={2} dot={false} name="AI Messages" />
                  <Line type="monotone" dataKey="tokens" stroke="#eab308" strokeWidth={2} dot={false} name="Tokens" />
                  <Line type="monotone" dataKey="code_execution" stroke="#3b82f6" strokeWidth={2} dot={false} name="Code Executions" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar chart */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Usage by Metric</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 15%)" />
                    <XAxis dataKey="metric" stroke="hsl(0 0% 40%)" fontSize={10} />
                    <YAxis stroke="hsl(0 0% 40%)" fontSize={12} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie chart */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Distribution</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="metric" cx="50%" cy="50%" outerRadius={80} label={false}>
                      {pieData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-3 justify-center mt-2">
                  {pieData.map((d, i) => (
                    <div key={d.metric} className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                      {d.metric}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

const tooltipStyle = { backgroundColor: "hsl(0 0% 8%)", border: "1px solid hsl(0 0% 20%)", borderRadius: "8px", color: "white", fontSize: "12px" };

function PageHeader({ icon: Icon, title, desc }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="p-2.5 rounded-xl bg-red-600/10 border border-red-600/30"><Icon className="w-5 h-5 text-red-400" /></div>
      <div>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        <p className="text-sm text-zinc-500">{desc}</p>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="py-20 text-center">
        <BarChart3 className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
        <p className="text-zinc-400 font-medium">No usage data yet</p>
        <p className="text-sm text-zinc-600 mt-1">Start using HackerAI to see your analytics here.</p>
      </CardContent>
    </Card>
  );
}