import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card-custom";
import { Badge } from "@/components/ui/badge-custom";
import { Copy, Check, Star, Edit2, Trash2, FileCode } from "lucide-react";

export default function SnippetCard({ snippet, onEdit, onDelete, onToggleFavorite }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className={snippet.is_favorite ? "border-red-900/40" : ""}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1.5 rounded-lg bg-zinc-800/60 flex-shrink-0">
              <FileCode className="w-3.5 h-3.5 text-zinc-400" />
            </div>
            <p className="text-sm font-medium text-white truncate">{snippet.title}</p>
          </div>
          <button
            onClick={() => onToggleFavorite(snippet)}
            className={`p-1 rounded transition-colors flex-shrink-0 ${snippet.is_favorite ? "text-red-400" : "text-zinc-600 hover:text-white"}`}
          >
            <Star className={`w-3.5 h-3.5 ${snippet.is_favorite ? "fill-current" : ""}`} />
          </button>
        </div>

        {snippet.description && (
          <p className="text-xs text-zinc-500 mb-2">{snippet.description}</p>
        )}

        <div className="relative rounded-lg border border-zinc-800 bg-zinc-950 p-3 mb-2 overflow-x-auto">
          <pre className="text-xs text-zinc-300 font-mono whitespace-pre-wrap max-h-32 overflow-hidden">
            {snippet.code}
          </pre>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant="secondary">{snippet.language}</Badge>
            {snippet.tags?.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handleCopy} className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors">
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button onClick={() => onEdit(snippet)} className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors">
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => onDelete(snippet)} className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}