import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card-custom";
import { MessageSquare, Code2, Upload, FileText, TrendingUp, Clock } from "lucide-react";
import { getPlan } from "@/lib/config/plans";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ chats: 0, files: 0, projects: 0 });
  const [loading, setLoading] = useState(true);
  const [recentChats, setRecentChats] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [chats, files, projects] = await Promise.all([
        base44.entities.Chat.filter({}, "-last_message_at", 5),
        base44.entities.File.list(5),
        base44.entities.Project.list(5),
      ]);
      setStats({
        chats: chats.length,
        files: files.length,
        projects: projects.length,
      });
      setRecentChats(chats);
    } catch (err) {
      console.error("Failed to load dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: "New Chat", path: "/chat", icon: MessageSquare, color: "text-red-500", bg: "bg-red-600/10 border-red-600/30" },
    { label: "Open Editor", path: "/editor", icon: Code2, color: "text-blue-500", bg: "bg-blue-600/10 border-blue-600/30" },
    { label: "Upload Files", path: "/files", icon: Upload, color: "text-green-500", bg: "bg-green-600/10 border-green-600/30" },
  ];

  const statCards = [
    { label: "Conversations", value: stats.chats, icon: MessageSquare },
    { label: "Files Uploaded", value: stats.files, icon: FileText },
    { label: "Projects", value: stats.projects, icon: Code2 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">
          Welcome back, {user?.full_name?.split(" ")[0] || "Developer"}
        </h1>
        <p className="text-sm text-zinc-400">
          Here's what's happening with your HackerAI workspace.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.path} to={action.path}>
              <Card className="hover:border-zinc-700 hover:bg-zinc-900/60 transition-all cursor-pointer group">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-lg border ${action.bg}`}>
                    <Icon className={`w-6 h-6 ${action.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-red-400 transition-colors">
                      {action.label}
                    </h3>
                    <p className="text-xs text-zinc-500">Click to start</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-zinc-400">{stat.label}</span>
                  <Icon className="w-4 h-4 text-zinc-600" />
                </div>
                <div className="text-3xl font-bold text-white">
                  {loading ? "—" : stat.value}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Chats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Conversations</CardTitle>
          <CardDescription>Your latest AI chat sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 rounded-lg bg-zinc-900/50 animate-pulse" />
              ))}
            </div>
          ) : recentChats.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
              <p className="text-sm text-zinc-500 mb-4">No conversations yet</p>
              <Link to="/chat" className="text-sm text-red-400 hover:text-red-300 font-medium">
                Start your first chat →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentChats.map((chat) => (
                <Link
                  key={chat.id}
                  to={`/chat/${chat.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-900/60 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <MessageSquare className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-zinc-200 truncate">
                      {chat.title}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-500 flex-shrink-0">
                    {chat.message_count || 0} messages
                  </span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}