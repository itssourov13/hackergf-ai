import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card-custom";
import { Button } from "@/components/ui/button-custom";
import { Badge } from "@/components/ui/badge-custom";
import { toast } from "@/components/ui/use-toast";
import { Sparkles, Loader2, Save, Eye, Terminal } from "lucide-react";

const TONES = [
  { value: "professional", label: "Professional", desc: "Formal and precise" },
  { value: "casual", label: "Casual", desc: "Relaxed and conversational" },
  { value: "friendly", label: "Friendly", desc: "Warm and approachable" },
  { value: "concise", label: "Concise", desc: "Short and to the point" },
  { value: "detailed", label: "Detailed", desc: "Thorough and comprehensive" },
];

const STYLES = [
  { value: "direct", label: "Direct", desc: "Straightforward answers" },
  { value: "explanatory", label: "Explanatory", desc: "Includes reasoning and context" },
  { value: "socratic", label: "Socratic", desc: "Asks guiding questions" },
  { value: "collaborative", label: "Collaborative", desc: "Works through problems together" },
];

const LENGTHS = [
  { value: "concise", label: "Concise" },
  { value: "balanced", label: "Balanced" },
  { value: "detailed", label: "Detailed" },
];

export default function PersonaSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await base44.entities.Settings.list();
      if (data?.length > 0) {
        setSettings(data[0]);
      } else {
        const created = await base44.entities.Settings.create({});
        setSettings(created);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const update = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.entities.Settings.update(settings.id, {
        ai_system_prompt: settings.ai_system_prompt,
        ai_tone: settings.ai_tone,
        ai_interaction_style: settings.ai_interaction_style,
        ai_response_length: settings.ai_response_length,
      });
      toast({ title: "Saved", description: "Zoya's persona settings updated." });
    } catch (err) {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const generatePreview = () => {
    const tone = TONES.find((t) => t.value === settings?.ai_tone)?.label || "Friendly";
    const style = STYLES.find((s) => s.value === settings?.ai_interaction_style)?.label || "Collaborative";
    const length = LENGTHS.find((l) => l.value === settings?.ai_response_length)?.label || "Balanced";
    const custom = settings?.ai_system_prompt?.trim();
    return `You are Zoya, an AI coding assistant from Hacker gf. Communicate in a ${tone.toLowerCase()} tone. Use a ${style.toLowerCase()} interaction style. Keep responses ${length.toLowerCase()}.${custom ? `\n\nAdditional instructions: ${custom}` : ""}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <Loader2 className="w-5 h-5 text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-red-600/10 border border-red-600/30">
          <Sparkles className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Zoya Persona</h1>
          <p className="text-sm text-zinc-500">Customize Zoya's system instructions, tone, and interaction style.</p>
        </div>
      </div>

      {/* Tone */}
      <Card className="mb-4">
        <CardContent className="p-5">
          <h2 className="text-sm font-semibold text-white mb-3">Tone of Voice</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {TONES.map((t) => (
              <button
                key={t.value}
                onClick={() => update("ai_tone", t.value)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  settings?.ai_tone === t.value
                    ? "bg-red-600/10 border-red-600/50"
                    : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <p className="text-sm font-medium text-white">{t.label}</p>
                <p className="text-xs text-zinc-500">{t.desc}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interaction Style */}
      <Card className="mb-4">
        <CardContent className="p-5">
          <h2 className="text-sm font-semibold text-white mb-3">Interaction Style</h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {STYLES.map((s) => (
              <button
                key={s.value}
                onClick={() => update("ai_interaction_style", s.value)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  settings?.ai_interaction_style === s.value
                    ? "bg-red-600/10 border-red-600/50"
                    : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <p className="text-sm font-medium text-white">{s.label}</p>
                <p className="text-xs text-zinc-500">{s.desc}</p>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Response Length */}
      <Card className="mb-4">
        <CardContent className="p-5">
          <h2 className="text-sm font-semibold text-white mb-3">Response Length</h2>
          <div className="flex gap-2">
            {LENGTHS.map((l) => (
              <button
                key={l.value}
                onClick={() => update("ai_response_length", l.value)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  settings?.ai_response_length === l.value
                    ? "bg-red-600/20 border border-red-600/50 text-red-300"
                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom System Prompt */}
      <Card className="mb-4">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">Custom System Instructions</h2>
            <Badge variant="secondary">Optional</Badge>
          </div>
          <textarea
            value={settings?.ai_system_prompt || ""}
            onChange={(e) => update("ai_system_prompt", e.target.value)}
            placeholder="Add custom instructions for Zoya. e.g., 'Always provide code examples in TypeScript and explain edge cases.'"
            rows={5}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-600/50 resize-none"
          />
        </CardContent>
      </Card>

      {/* Preview */}
      {showPreview && (
        <Card className="mb-4 border-red-900/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Terminal className="w-4 h-4 text-red-400" />
              <h2 className="text-sm font-semibold text-white">Generated System Prompt Preview</h2>
            </div>
            <pre className="text-xs text-zinc-400 whitespace-pre-wrap font-mono bg-zinc-950 rounded-lg p-3 border border-zinc-800">
              {generatePreview()}
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={() => setShowPreview(!showPreview)}>
          <Eye className="w-3.5 h-3.5" />
          {showPreview ? "Hide Preview" : "Preview Prompt"}
        </Button>
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}