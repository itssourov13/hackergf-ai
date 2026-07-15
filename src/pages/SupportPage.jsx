import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card-custom";
import { Button } from "@/components/ui/button-custom";
import { Badge } from "@/components/ui/badge-custom";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LifeBuoy, Send, Loader2, BookOpen, Github, MessageSquare, ExternalLink, Mail } from "lucide-react";

const DOC_LINKS = [
  { title: "Getting Started", desc: "Set up your account and first project", icon: BookOpen },
  { title: "AI Chat Guide", desc: "Learn how to use the AI assistant effectively", icon: MessageSquare },
  { title: "Code Editor Docs", desc: "Master the built-in code editor and terminal", icon: BookOpen },
  { title: "API Reference", desc: "Programmatic access via REST API keys", icon: ExternalLink },
];

const CHANNELS = [
  { name: "GitHub", desc: "Report bugs and request features", icon: Github, href: "#" },
  { name: "Community", desc: "Join our Discord community", icon: MessageSquare, href: "#" },
  { name: "Email Support", desc: "Reach out directly to our team", icon: Mail, href: "#" },
];

const CATEGORIES = [
  { value: "general", label: "General Inquiry" },
  { value: "bug", label: "Bug Report" },
  { value: "feature_request", label: "Feature Request" },
  { value: "billing", label: "Billing Question" },
  { value: "account", label: "Account Issue" },
];

export default function SupportPage() {
  const { toast } = useToast();
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("general");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) return;
    setSending(true);
    try {
      await base44.entities.SupportTicket.create({
        subject: subject.trim(),
        message: message.trim(),
        category,
        status: "open",
        priority: "medium",
      });
      toast({ title: "Message sent!", description: "We'll get back to you soon." });
      setSubject(""); setMessage(""); setCategory("general");
    } catch (err) {
      toast({ title: "Failed to send", description: err.message, variant: "destructive" });
    } finally { setSending(false); }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-red-600/10 border border-red-600/30"><LifeBuoy className="w-5 h-5 text-red-400" /></div>
        <div>
          <h1 className="text-xl font-bold text-white">Support Center</h1>
          <p className="text-sm text-zinc-500">Find documentation or reach out to our team.</p>
        </div>
      </div>

      {/* Doc links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {DOC_LINKS.map((d) => {
          const Icon = d.icon;
          return (
            <Card key={d.title} className="hover:border-zinc-700 cursor-pointer transition-colors">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-zinc-800/60"><Icon className="w-5 h-5 text-red-400" /></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{d.title}</p>
                  <p className="text-xs text-zinc-500">{d.desc}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-zinc-600" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Contact form */}
      <Card className="mb-6">
        <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Send className="w-4 h-4 text-red-400" /> Contact Us</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-zinc-300 mb-1.5 block">Subject</label>
            <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Brief summary of your issue" className="bg-zinc-900 border-zinc-700" />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-300 mb-1.5 block">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-red-900/50">
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-300 mb-1.5 block">Message</label>
            <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Describe your issue or question in detail..." rows={5} className="bg-zinc-900 border-zinc-700 resize-none" />
          </div>
          <Button onClick={handleSubmit} disabled={sending || !subject.trim() || !message.trim()} className="bg-red-600 hover:bg-red-500 w-full">
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Send Message
          </Button>
        </CardContent>
      </Card>

      {/* Channels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {CHANNELS.map((ch) => {
          const Icon = ch.icon;
          return (
            <Card key={ch.name} className="hover:border-zinc-700 cursor-pointer transition-colors">
              <CardContent className="p-4 text-center">
                <Icon className="w-6 h-6 text-red-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-white">{ch.name}</p>
                <p className="text-xs text-zinc-500 mt-0.5">{ch.desc}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}