import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card-custom";
import { Button } from "@/components/ui/button-custom";
import { Badge } from "@/components/ui/badge-custom";
import { Loader2, Save, Check } from "lucide-react";
import { AI_MODELS } from "@/lib/config/aiProviders";
import { getPlan, PLAN_LIST } from "@/lib/config/plans";

export default function SettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await base44.entities.Settings.list("-created_date", 1);
      if (data.length > 0) {
        setSettings(data[0]);
      } else {
        const newSettings = await base44.entities.Settings.create({
          theme: "dark",
          preferred_model: "automatic",
          code_editor_font_size: 14,
          code_editor_word_wrap: true,
          code_editor_minimap: false,
          terminal_font_size: 13,
          email_notifications: true,
        });
        setSettings(newSettings);
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
      setSettings({
        theme: "dark",
        preferred_model: "automatic",
        code_editor_font_size: 14,
        code_editor_word_wrap: true,
        code_editor_minimap: false,
        terminal_font_size: 13,
        email_notifications: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (settings.id) {
        await base44.entities.Settings.update(settings.id, settings);
      } else {
        const created = await base44.entities.Settings.create(settings);
        setSettings(created);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Failed to save settings:", err);
    } finally {
      setSaving(false);
    }
  };

  const update = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Settings</h1>
        <p className="text-sm text-zinc-400">Manage your preferences and configuration.</p>
      </div>

      {/* Account */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Name</span>
            <span className="text-sm text-white">{user?.full_name || "—"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Email</span>
            <span className="text-sm text-white">{user?.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Role</span>
            <Badge variant="secondary" className="uppercase">{user?.role || "user"}</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Plan</span>
            <Badge variant="default" className="uppercase">Free</Badge>
          </div>
        </CardContent>
      </Card>

      {/* AI Preferences */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>AI Preferences</CardTitle>
          <CardDescription>Configure your default AI model</CardDescription>
        </CardHeader>
        <CardContent>
          <label className="text-sm text-zinc-400 mb-2 block">Preferred Model</label>
          <select
            value={settings.preferred_model}
            onChange={(e) => update("preferred_model", e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-red-900/50"
          >
            {Object.values(AI_MODELS).map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} {model.premium ? "(Pro)" : ""}
              </option>
            ))}
          </select>
          <p className="text-xs text-zinc-500 mt-2">
            {AI_MODELS[settings.preferred_model]?.description}
          </p>

          <div className="mt-4">
            <label className="text-sm text-zinc-400 mb-2 block">Custom System Prompt</label>
            <textarea
              value={settings.ai_system_prompt || ""}
              onChange={(e) => update("ai_system_prompt", e.target.value)}
              placeholder="Add a custom system prompt to override the default..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-900/50 resize-none"
            />
          </div>
        </CardContent>
      </Card>

      {/* Editor Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Editor Settings</CardTitle>
          <CardDescription>Customize your code editor</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-zinc-400 mb-2 block">Font Size: {settings.code_editor_font_size}px</label>
            <input
              type="range"
              min="10"
              max="24"
              value={settings.code_editor_font_size}
              onChange={(e) => update("code_editor_font_size", parseInt(e.target.value))}
              className="w-full accent-red-500"
            />
          </div>
          <ToggleRow
            label="Word Wrap"
            value={settings.code_editor_word_wrap}
            onChange={(v) => update("code_editor_word_wrap", v)}
          />
          <ToggleRow
            label="Show Minimap"
            value={settings.code_editor_minimap}
            onChange={(v) => update("code_editor_minimap", v)}
          />
          <div>
            <label className="text-sm text-zinc-400 mb-2 block">Terminal Font Size: {settings.terminal_font_size}px</label>
            <input
              type="range"
              min="10"
              max="20"
              value={settings.terminal_font_size}
              onChange={(e) => update("terminal_font_size", parseInt(e.target.value))}
              className="w-full accent-red-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Manage your notification preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <ToggleRow
            label="Email Notifications"
            value={settings.email_notifications}
            onChange={(v) => update("email_notifications", v)}
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        {saved && (
          <span className="flex items-center gap-1 text-sm text-green-400">
            <Check className="w-4 h-4" /> Saved!
          </span>
        )}
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Settings
        </Button>
      </div>
    </div>
  );
}

function ToggleRow({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-zinc-400">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`relative w-11 h-6 rounded-full transition-colors ${value ? "bg-red-600" : "bg-zinc-700"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${value ? "translate-x-5" : ""}`}
        />
      </button>
    </div>
  );
}