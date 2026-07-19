import React from "react";
import { Card, CardContent } from "@/components/ui/card-custom";
import { Badge } from "@/components/ui/badge-custom";
import { ChevronUp, MessageCircle } from "lucide-react";

const CATEGORY_LABELS = {
  feature_request: "Feature Request",
  bug_report: "Bug Report",
  improvement: "Improvement",
  other: "Other",
};

const STATUS_LABELS = {
  open: { label: "Open", variant: "default" },
  in_review: { label: "In Review", variant: "warning" },
  planned: { label: "Planned", variant: "default" },
  in_progress: { label: "In Progress", variant: "warning" },
  completed: { label: "Completed", variant: "success" },
  declined: { label: "Declined", variant: "secondary" },
};

export default function FeedbackCard({ item, onVote, hasVoted }) {
  const status = STATUS_LABELS[item.status] || STATUS_LABELS.open;

  return (
    <Card>
      <CardContent className="p-4 flex items-start gap-3">
        <button
          onClick={() => onVote(item)}
          className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors flex-shrink-0 ${
            hasVoted ? "bg-red-600/20 text-red-400" : "bg-zinc-800/60 text-zinc-400 hover:text-white"
          }`}
        >
          <ChevronUp className="w-4 h-4" />
          <span className="text-xs font-bold">{item.votes || 0}</span>
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm font-medium text-white">{item.title}</p>
            <Badge variant={status.variant}>{status.label}</Badge>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed mb-2">{item.description}</p>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{CATEGORY_LABELS[item.category] || item.category}</Badge>
            <span className="text-xs text-zinc-600 flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              {item.votes || 0} votes
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}