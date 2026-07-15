import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card-custom";
import { Badge } from "@/components/ui/badge-custom";
import { ShieldAlert, Loader2, LogIn, LogOut, KeyRound, FileText, Settings } from "lucide-react";

const ACTION_ICONS = {
  login: LogIn, logout: LogOut, api_key_created: KeyRound, api_key_revoked: KeyRound,
  settings_changed: Settings, file_uploaded: FileText,
};

export default function SecurityLogPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadLogs(); }, []);

  const loadLogs = async () => {
    try {
      const data = await base44.entities.SecurityLog.filter({}, "-created_date", 100);
      setLogs(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-red-600/10 border border-red-600/30"><ShieldAlert className="w-5 h-5 text-red-400" /></div>
        <div>
          <h1 className="text-xl font-bold text-white">Security Log</h1>
          <p className="text-sm text-zinc-500">Audit trail of login events, IP addresses, and sensitive account actions.</p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-white">{logs.filter((l) => l.action === "login").length}</p>
          <p className="text-xs text-zinc-500">Logins</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-white">{logs.filter((l) => l.severity === "warning").length}</p>
          <p className="text-xs text-zinc-500">Warnings</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-white">{logs.filter((l) => l.severity === "critical").length}</p>
          <p className="text-xs text-zinc-500">Critical</p>
        </CardContent></Card>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-zinc-600 animate-spin" /></div>
      ) : logs.length === 0 ? (
        <Card><CardContent className="py-20 text-center">
          <ShieldAlert className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-400 font-medium">No security events logged</p>
          <p className="text-sm text-zinc-600 mt-1">Security events will appear here as they occur.</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => {
            const Icon = ACTION_ICONS[log.action] || ShieldAlert;
            return (
              <Card key={log.id}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    log.severity === "critical" ? "bg-red-950/40" : log.severity === "warning" ? "bg-yellow-950/40" : "bg-zinc-800/60"
                  }`}>
                    <Icon className={`w-4 h-4 ${
                      log.severity === "critical" ? "text-red-400" : log.severity === "warning" ? "text-yellow-400" : "text-zinc-400"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-white capitalize">{log.action.replace(/_/g, " ")}</p>
                      <Badge variant={log.severity === "critical" ? "default" : log.severity === "warning" ? "warning" : "secondary"}>
                        {log.severity}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-zinc-500">
                      {log.ip_address && <span>IP: {log.ip_address}</span>}
                      <span>{new Date(log.created_date).toLocaleString()}</span>
                    </div>
                    {log.details && <p className="text-xs text-zinc-600 mt-0.5 truncate">{log.details}</p>}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}