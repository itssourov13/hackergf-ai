import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card-custom";
import { Badge } from "@/components/ui/badge-custom";
import { Button } from "@/components/ui/button-custom";
import { useToast } from "@/components/ui/use-toast";
import { KeyRound, Plus, Trash2, Copy, Check, Loader2, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ApiKeysPage() {
  const { toast } = useToast();
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [createdKey, setCreatedKey] = useState(null);
  const [copied, setCopied] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => { loadKeys(); }, []);

  const loadKeys = async () => {
    try {
      const data = await base44.entities.ApiKey.filter({}, "-created_date", 50);
      setKeys(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const generateKey = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
    let key = "hkai_";
    for (let i = 0; i < 48; i++) key += chars[Math.floor(Math.random() * chars.length)];
    return key;
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const rawKey = generateKey();
      const prefix = rawKey.slice(0, 12);
      const record = await base44.entities.ApiKey.create({
        name: newName.trim(),
        key_prefix: prefix,
        key_hash: btoa(rawKey),
        permissions: ["chat", "files", "code"],
        is_active: true,
      });
      setCreatedKey(rawKey);
      setKeys([record, ...keys]);
      setNewName("");
      toast({ title: "API Key created", description: "Copy it now — you won't see it again." });
    } catch (err) {
      toast({ title: "Failed to create key", description: err.message, variant: "destructive" });
    } finally { setCreating(false); }
  };

  const handleRevoke = async (id) => {
    if (!confirm("Revoke this API key? This cannot be undone.")) return;
    try {
      await base44.entities.ApiKey.delete(id);
      setKeys(keys.filter((k) => k.id !== id));
      toast({ title: "Key revoked" });
    } catch (err) { toast({ title: "Failed to revoke", description: err.message, variant: "destructive" }); }
  };

  const copyKey = (key) => {
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Header />
      <CreateButton show={showCreate} setShow={setShowCreate} />

      {showCreate && (
        <Card className="mb-6">
          <CardContent className="p-5 space-y-3">
            <label className="text-sm font-medium text-zinc-300">Key Name</label>
            <div className="flex gap-2">
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Production API Key" className="bg-zinc-900 border-zinc-700" />
              <Button onClick={handleCreate} disabled={creating || !newName.trim()} className="bg-red-600 hover:bg-red-500">
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
              </Button>
            </div>
            {createdKey && (
              <div className="mt-4 p-4 rounded-lg bg-green-950/30 border border-green-900/40">
                <p className="text-xs text-green-400 font-medium mb-2">Your new API key (shown once):</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm text-green-300 font-mono break-all">{createdKey}</code>
                  <Button size="icon" variant="ghost" onClick={() => copyKey(createdKey)} className="text-green-400 hover:text-green-300">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-zinc-600 animate-spin" /></div>
      ) : keys.length === 0 ? (
        <Card><CardContent className="py-20 text-center">
          <KeyRound className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-400 font-medium">No API keys yet</p>
          <p className="text-sm text-zinc-600 mt-1">Create a key to access Hacker gf programmatically.</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {keys.map((k) => (
            <Card key={k.id}>
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-2 rounded-lg bg-zinc-800/60"><KeyRound className="w-5 h-5 text-red-400" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-white text-sm">{k.name}</p>
                    {k.is_active ? <Badge variant="success">Active</Badge> : <Badge variant="warning">Revoked</Badge>}
                  </div>
                  <p className="text-xs text-zinc-500 font-mono mt-0.5">{k.key_prefix}••••••••••••••••</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-600">
                    {(k.permissions || []).map((p) => <span key={p} className="px-1.5 py-0.5 rounded bg-zinc-800/60">{p}</span>)}
                    {k.last_used && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Used {new Date(k.last_used).toLocaleDateString()}</span>}
                  </div>
                </div>
                <Button variant="ghost" onClick={() => handleRevoke(k.id)} className="text-zinc-500 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function Header() {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="p-2.5 rounded-xl bg-red-600/10 border border-red-600/30"><KeyRound className="w-5 h-5 text-red-400" /></div>
      <div>
        <h1 className="text-xl font-bold text-white">API Keys</h1>
        <p className="text-sm text-zinc-500">Generate and manage keys for programmatic access to your Hacker gf projects.</p>
      </div>
    </div>
  );
}

function CreateButton({ show, setShow }) {
  return (
    <Button onClick={() => setShow(!show)} className="mb-6 bg-red-600 hover:bg-red-500">
      <Plus className="w-4 h-4" /> {show ? "Cancel" : "Generate New Key"}
    </Button>
  );
}