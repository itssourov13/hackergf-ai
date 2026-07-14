import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card-custom";
import { Badge } from "@/components/ui/badge-custom";
import { Loader2, Users, MessageSquare, FileText, Code2, TrendingUp, Activity, Shield } from "lucide-react";
import { FEATURE_FLAGS } from "@/lib/config/featureFlags";
import { getUserUsage } from "@/lib/usage";

export default function AdminPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ users: 0, chats: 0, files: 0, projects: 0 });
  const [users, setUsers] = useState([]);
  const [usage, setUsage] = useState({});
  const [flags, setFlags] = useState(FEATURE_FLAGS);

  useEffect(() => {
    if (user?.role !== "admin") return;
    loadAdminData();
  }, [user]);

  const loadAdminData = async () => {
    try {
      const [chats, files, projects, usersList, usageData] = await Promise.all([
        base44.entities.Chat.list(),
        base44.entities.File.list(),
        base44.entities.Project.list(),
        base44.entities.User.list(),
        getUserUsage(),
      ]);
      setStats({
        users: usersList.length,
        chats: chats.length,
        files: files.length,
        projects: projects.length,
      });
      setUsers(usersList);
      setUsage(usageData);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-sm text-zinc-400">You need admin privileges to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Users", value: stats.users, icon: Users },
    { label: "Conversations", value: stats.chats, icon: MessageSquare },
    { label: "Files Uploaded", value: stats.files, icon: FileText },
    { label: "Projects", value: stats.projects, icon: Code2 },
  ];

  const usageCards = [
    { label: "AI Messages", value: usage.ai_messages || 0, icon: MessageSquare },
    { label: "File Uploads", value: usage.file_uploads || 0, icon: FileText },
    { label: "Code Executions", value: usage.code_executions || 0, icon: Code2 },
    { label: "API Requests", value: usage.api_requests || 0, icon: Activity },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-5 h-5 text-red-500" />
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        </div>
        <p className="text-sm text-zinc-400">System overview and user management.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-400">{stat.label}</span>
                  <Icon className="w-4 h-4 text-zinc-600" />
                </div>
                <div className="text-3xl font-bold text-white">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Usage This Period */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-500" />
            Usage This Period
          </CardTitle>
          <CardDescription>Aggregated usage metrics for the current billing cycle</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {usageCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-zinc-500">{stat.label}</span>
                    <Icon className="w-3.5 h-3.5 text-zinc-600" />
                  </div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Feature Flags */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Feature Flags</CardTitle>
          <CardDescription>View feature flag configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.values(flags).map((flag) => (
              <div key={flag.key} className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/50">
                <div>
                  <span className="text-sm font-medium text-white">{flag.name}</span>
                  <p className="text-xs text-zinc-500 mt-0.5">{flag.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  {flag.beta && <Badge variant="warning" className="text-[10px]">BETA</Badge>}
                  <Badge variant={flag.enabled ? "success" : "default"} className="text-[10px]">
                    {flag.enabled ? "ENABLED" : "DISABLED"}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px] uppercase">{flag.minPlan}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* User Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">User Management</CardTitle>
          <CardDescription>All registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {users.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-400 text-xs font-bold">
                    {u.full_name?.charAt(0)?.toUpperCase() || u.email?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{u.full_name || "Unknown"}</p>
                    <p className="text-xs text-zinc-500">{u.email}</p>
                  </div>
                </div>
                <Badge variant={u.role === "admin" ? "default" : "secondary"} className="uppercase">
                  {u.role || "user"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}