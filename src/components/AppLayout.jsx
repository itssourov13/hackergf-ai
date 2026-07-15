import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { Terminal, LayoutDashboard, MessageSquare, Code2, Upload, Settings, LogOut, Menu, X, CreditCard, Shield, BarChart3, KeyRound, FolderGit2, LifeBuoy, BookOpen, Activity, Keyboard, Gauge, Cpu, ShieldAlert, Command } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_SECTIONS = [
  {
    label: null,
    items: [
      { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { label: "AI Chat", path: "/chat", icon: MessageSquare },
      { label: "Code Editor", path: "/editor", icon: Code2 },
      { label: "Files", path: "/files", icon: Upload },
      { label: "Projects", path: "/projects", icon: FolderGit2 },
    ],
  },
  {
    label: "Insights",
    items: [
      { label: "Usage Analytics", path: "/analytics", icon: BarChart3 },
      { label: "Usage Quotas", path: "/quotas", icon: Gauge },
      { label: "Model Comparison", path: "/models", icon: Cpu },
      { label: "Billing", path: "/billing", icon: CreditCard },
    ],
  },
  {
    label: "Developer",
    items: [
      { label: "API Keys", path: "/api-keys", icon: KeyRound },
      { label: "Security Log", path: "/security-log", icon: ShieldAlert },
      { label: "Quick Commands", path: "/commands", icon: Command },
      { label: "Keyboard Shortcuts", path: "/shortcuts", icon: Keyboard },
    ],
  },
  {
    label: "Resources",
    items: [
      { label: "Documentation", path: "/docs", icon: BookOpen },
      { label: "Support Center", path: "/support", icon: LifeBuoy },
      { label: "System Status", path: "/status", icon: Activity },
      { label: "Settings", path: "/settings", icon: Settings },
    ],
  },
];

const ADMIN_ITEMS = [
  { label: "Admin", path: "/admin", icon: Shield },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    logout();
  };

  const isActive = (path) => {
    if (path === "/chat") return location.pathname.startsWith("/chat");
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex w-64 flex-col border-r border-zinc-800 bg-black fixed inset-y-0 left-0 z-30">
        <SidebarContent
          user={user}
          isActive={isActive}
          onLogout={handleLogout}
          isAdmin={isAdmin}
        />
      </aside>

      {/* Sidebar - Mobile */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-black border-r border-zinc-800 z-50 md:hidden">
            <SidebarContent
              user={user}
              isActive={isActive}
              onLogout={handleLogout}
              isAdmin={isAdmin}
              onClose={() => setSidebarOpen(false)}
            />
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <header className="md:hidden flex items-center justify-between h-14 px-4 border-b border-zinc-800 bg-black sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-zinc-400 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/dashboard" className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-red-500" />
            <span className="font-bold text-white">Hacker<span className="text-red-500">AI</span></span>
          </Link>
          <div className="w-9" />
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ user, isActive, onLogout, isAdmin, onClose }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between h-16 px-4 border-b border-zinc-800">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-600/10 border border-red-600/30">
            <Terminal className="w-5 h-5 text-red-500" />
          </div>
          <span className="font-bold text-white">Hacker<span className="text-red-500">AI</span></span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-3 overflow-y-auto">
        {NAV_SECTIONS.map((section, si) => (
          <div key={si}>
            {section.label && (
              <div className="text-xs font-semibold text-zinc-600 uppercase tracking-wide px-3 mb-1">{section.label}</div>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive(item.path)
                        ? "bg-red-600/10 text-red-400 border border-red-900/40"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-white border border-transparent"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {isAdmin && (
        <div className="px-3 pb-2">
          <div className="text-xs font-semibold text-zinc-600 uppercase tracking-wide px-2 mb-1">Administration</div>
          <nav className="space-y-1">
            {ADMIN_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive(item.path)
                      ? "bg-red-600/10 text-red-400 border border-red-900/40"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white border border-transparent"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}

      <div className="p-3 border-t border-zinc-800">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-400 text-xs font-bold">
            {user?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.full_name || "User"}</p>
            <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}