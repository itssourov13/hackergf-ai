import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button-custom";
import { Loader2, Plus, MessageCircle, Filter } from "lucide-react";
import FeedbackForm from "@/components/feedback/FeedbackForm";
import FeedbackCard from "@/components/feedback/FeedbackCard";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "feature_request", label: "Features" },
  { value: "bug_report", label: "Bugs" },
  { value: "improvement", label: "Improvements" },
];

export default function FeedbackPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [votedIds, setVotedIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem("votedFeedback") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    try {
      const data = await base44.entities.Feedback.filter({}, "-votes", 100);
      setItems(data);
    } catch (err) {
      console.error("Failed to load feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    const created = await base44.entities.Feedback.create({ ...data, votes: 0 });
    setItems((prev) => [created, ...prev]);
    setShowForm(false);
  };

  const handleVote = async (item) => {
    if (votedIds.includes(item.id)) return;
    const newVotes = (item.votes || 0) + 1;
    await base44.entities.Feedback.update(item.id, { votes: newVotes });
    setItems((prev) => prev.map((f) => (f.id === item.id ? { ...f, votes: newVotes } : f)));
    const updated = [...votedIds, item.id];
    setVotedIds(updated);
    localStorage.setItem("votedFeedback", JSON.stringify(updated));
  };

  const filtered = filter === "all" ? items : items.filter((f) => f.category === filter);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-600/10 border border-red-600/30">
            <MessageCircle className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Feedback Portal</h1>
            <p className="text-sm text-zinc-500">Post feature requests and vote on improvements.</p>
          </div>
        </div>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="w-3.5 h-3.5" />
          New Feedback
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-3.5 h-3.5 text-zinc-600" />
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              filter === f.value
                ? "bg-red-600/20 border border-red-600/50 text-red-300"
                : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-5 h-5 text-red-500 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-sm text-zinc-600">
          No feedback yet. Be the first to share an idea!
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((item) => (
            <FeedbackCard key={item.id} item={item} onVote={handleVote} hasVoted={votedIds.includes(item.id)} />
          ))}
        </div>
      )}

      {showForm && <FeedbackForm onSubmit={handleSubmit} onClose={() => setShowForm(false)} />}
    </div>
  );
}