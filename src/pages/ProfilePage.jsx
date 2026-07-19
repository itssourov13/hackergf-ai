import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useAuth } from "@/lib/AuthContext";
import { Card, CardContent } from "@/components/ui/card-custom";
import { Button } from "@/components/ui/button-custom";
import { Badge } from "@/components/ui/badge-custom";
import { toast } from "@/components/ui/use-toast";
import { User, Mail, Shield, Bell, Save, Loader2, Calendar, KeyRound } from "lucide-react";

export default function ProfilePage() {
  const { user, checkUserAuth } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState({
    email_updates: true,
    product_news: true,
    security_alerts: true,
  });

  useEffect(() => {
    if (user) {
      setDisplayName(user.full_name || user.display_name || "");
      if (user.contact_preferences) {
        setPrefs(user.contact_preferences);
      }
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({
        display_name: displayName,
        contact_preferences: prefs,
      });
      await checkUserAuth();
      toast({ title: "Saved", description: "Profile updated successfully." });
    } catch (err) {
      toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const togglePref = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!user) {
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
          <User className="w-5 h-5 text-red-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">User Profile</h1>
          <p className="text-sm text-zinc-500">Manage your display name, contact preferences, and account security.</p>
        </div>
      </div>

      {/* Profile header */}
      <Card className="mb-4">
        <CardContent className="p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-400 text-2xl font-bold">
            {(displayName || user.email)?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-semibold text-white">{displayName || "User"}</p>
            <p className="text-sm text-zinc-500 truncate">{user.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role || "user"}</Badge>
              <span className="text-xs text-zinc-600 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {user.created_date ? new Date(user.created_date).toLocaleDateString() : "N/A"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Display name */}
      <Card className="mb-4">
        <CardContent className="p-5">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-zinc-400" />
            Display Name
          </h2>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Your display name"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-600/50"
          />
        </CardContent>
      </Card>

      {/* Contact preferences */}
      <Card className="mb-4">
        <CardContent className="p-5">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-zinc-400" />
            Contact Preferences
          </h2>
          <div className="space-y-3">
            {[
              { key: "email_updates", label: "Email Updates", desc: "Product updates and announcements" },
              { key: "product_news", label: "Product News", desc: "New features and releases" },
              { key: "security_alerts", label: "Security Alerts", desc: "Important account security notifications" },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white">{item.label}</p>
                  <p className="text-xs text-zinc-500">{item.desc}</p>
                </div>
                <button
                  onClick={() => togglePref(item.key)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${prefs[item.key] ? "bg-red-600" : "bg-zinc-700"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${prefs[item.key] ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Account security */}
      <Card className="mb-4">
        <CardContent className="p-5">
          <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-zinc-400" />
            Account Security
          </h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-zinc-500" />
                <div>
                  <p className="text-sm text-white">Email Address</p>
                  <p className="text-xs text-zinc-500">{user.email}</p>
                </div>
              </div>
              <Badge variant="success">Verified</Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800">
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-zinc-500" />
                <div>
                  <p className="text-sm text-white">Password</p>
                  <p className="text-xs text-zinc-500">Last changed: N/A</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => window.location.href = "/forgot-password"}>
                Change
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-zinc-900 border border-zinc-800">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-zinc-500" />
                <div>
                  <p className="text-sm text-white">Two-Factor Authentication</p>
                  <p className="text-xs text-zinc-500">Add an extra layer of security</p>
                </div>
              </div>
              <Badge variant="secondary">Not Enabled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button size="sm" onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save Changes
        </Button>
      </div>
    </div>
  );
}