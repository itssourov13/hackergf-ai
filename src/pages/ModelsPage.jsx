import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card-custom";
import { Badge } from "@/components/ui/badge-custom";
import { Button } from "@/components/ui/button-custom";
import { Cpu, Zap, Check, ArrowRight, Star } from "lucide-react";
import { AI_MODELS } from "@/lib/config/aiProviders";

export default function ModelsPage() {
  const models = Object.values(AI_MODELS);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-red-600/10 border border-red-600/30"><Cpu className="w-5 h-5 text-red-400" /></div>
        <div>
          <h1 className="text-xl font-bold text-white">Model Comparison</h1>
          <p className="text-sm text-zinc-500">Compare AI models to choose the right one for your task.</p>
        </div>
      </div>

      {/* Comparison table - Desktop */}
      <Card className="hidden md:block overflow-hidden mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="text-left p-4 text-xs font-semibold text-zinc-400 uppercase">Model</th>
              <th className="text-left p-4 text-xs font-semibold text-zinc-400 uppercase">Provider</th>
              <th className="text-left p-4 text-xs font-semibold text-zinc-400 uppercase">Strengths</th>
              <th className="text-left p-4 text-xs font-semibold text-zinc-400 uppercase">Speed</th>
              <th className="text-left p-4 text-xs font-semibold text-zinc-400 uppercase">Cost</th>
              <th className="text-right p-4 text-xs font-semibold text-zinc-400 uppercase"></th>
            </tr>
          </thead>
          <tbody>
            {models.map((m) => (
              <tr key={m.id} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-900/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-white text-sm">{m.name}</span>
                    {m.premium && <Badge variant="warning">PRO</Badge>}
                  </div>
                </td>
                <td className="p-4 text-sm text-zinc-400">{m.provider}</td>
                <td className="p-4 text-sm text-zinc-400">{m.description}</td>
                <td className="p-4"><SpeedBadge speed={m.speed} /></td>
                <td className="p-4"><CostBadge cost={m.cost} /></td>
                <td className="p-4 text-right">
                  <Link to="/chat"><Button variant="ghost" className="text-red-400 hover:text-red-300 text-xs">Use <ArrowRight className="w-3 h-3" /></Button></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Cards - Mobile */}
      <div className="md:hidden space-y-3 mb-6">
        {models.map((m) => (
          <Card key={m.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white text-sm">{m.name}</span>
                  {m.premium && <Badge variant="warning">PRO</Badge>}
                </div>
                <span className="text-xs text-zinc-500">{m.provider}</span>
              </div>
              <p className="text-sm text-zinc-400 mb-3">{m.description}</p>
              <div className="flex items-center gap-2">
                <SpeedBadge speed={m.speed} />
                <CostBadge cost={m.cost} />
              </div>
              <Link to="/chat"><Button variant="ghost" className="text-red-400 hover:text-red-300 text-xs mt-3 w-full">Use this model <ArrowRight className="w-3 h-3" /></Button></Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendation cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-red-900/40">
          <CardContent className="p-5 text-center">
            <Zap className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="font-medium text-white text-sm">For Speed</p>
            <p className="text-xs text-zinc-500 mt-1">Use Gemini 3 Flash or GPT-5 Mini for quick responses and simple tasks.</p>
          </CardContent>
        </Card>
        <Card className="border-red-900/40">
          <CardContent className="p-5 text-center">
            <Star className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="font-medium text-white text-sm">For Quality</p>
            <p className="text-xs text-zinc-500 mt-1">Use Claude Opus or GPT-5.5 for complex reasoning and code generation.</p>
          </CardContent>
        </Card>
        <Card className="border-red-900/40">
          <CardContent className="p-5 text-center">
            <Check className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="font-medium text-white text-sm">Balanced</p>
            <p className="text-xs text-zinc-500 mt-1">Use Automatic mode to let Hacker gf pick the best model for each query.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SpeedBadge({ speed }) {
  if (!speed) return <Badge variant="secondary">Standard</Badge>;
  const labels = { fast: "Fast", medium: "Medium", slow: "Slow" };
  const variants = { fast: "success", medium: "default", slow: "warning" };
  return <Badge variant={variants[speed] || "secondary"}>{labels[speed] || speed}</Badge>;
}

function CostBadge({ cost }) {
  if (cost === "free" || cost === "low") return <Badge variant="success">{cost}</Badge>;
  if (cost === "medium") return <Badge variant="warning">medium</Badge>;
  if (cost === "high" || cost === "premium") return <Badge variant="default">{cost}</Badge>;
  return <Badge variant="secondary">{cost || "standard"}</Badge>;
}