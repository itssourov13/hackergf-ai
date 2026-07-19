import React, { useState } from "react";
import { Button } from "@/components/ui/button-custom";
import { X, Loader2 } from "lucide-react";

const CATEGORIES = [
  { value: "feature_request", label: "Feature Request" },
  { value: "bug_report", label: "Bug Report" },
  { value: "improvement", label: "Improvement" },
  { value: "other", label: "Other" },
];

export default function FeedbackForm({ onSubmit, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("feature_request");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit({ title: title.trim(), description: description.trim(), category });
      setTitle("");
      setDescription("");
      setCategory("feature_request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800">
          <h2 className="text-base font-semibold text-white">Submit Feedback</h2>
          <button onClick={onClose} className="p-1 text-zinc-500 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief summary of your idea"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-600/50"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Category</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    category === cat.value
                      ? "bg-red-600/20 border border-red-600/50 text-red-300"
                      : "bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your feedback in detail..."
              rows={4}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-600/50 resize-none"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancel</Button>
            <Button type="submit" size="sm" disabled={submitting || !title.trim() || !description.trim()}>
              {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Submit"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}