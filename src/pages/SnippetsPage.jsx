import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button-custom";
import { Loader2, Plus, Search, FileCode } from "lucide-react";
import SnippetForm from "@/components/snippets/SnippetForm";
import SnippetCard from "@/components/snippets/SnippetCard";

export default function SnippetsPage() {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState("all");

  useEffect(() => {
    loadSnippets();
  }, []);

  const loadSnippets = async () => {
    try {
      const data = await base44.entities.CodeSnippet.filter({}, "-created_date", 100);
      setSnippets(data);
    } catch (err) {
      console.error("Failed to load snippets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data) => {
    const created = await base44.entities.CodeSnippet.create(data);
    setSnippets((prev) => [created, ...prev]);
    setShowForm(false);
  };

  const handleUpdate = async (data) => {
    const updated = await base44.entities.CodeSnippet.update(editing.id, data);
    setSnippets((prev) => prev.map((s) => (s.id === editing.id ? updated : s)));
    setEditing(null);
    setShowForm(false);
  };

  const handleDelete = async (snippet) => {
    if (!confirm(`Delete "${snippet.title}"?`)) return;
    await base44.entities.CodeSnippet.delete(snippet.id);
    setSnippets((prev) => prev.filter((s) => s.id !== snippet.id));
  };

  const handleToggleFavorite = async (snippet) => {
    const updated = await base44.entities.CodeSnippet.update(snippet.id, { is_favorite: !snippet.is_favorite });
    setSnippets((prev) => prev.map((s) => (s.id === snippet.id ? updated : s)));
  };

  const handleEdit = (snippet) => {
    setEditing(snippet);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditing(null);
  };

  const languages = ["all", ...new Set(snippets.map((s) => s.language))];

  const filtered = snippets.filter((s) => {
    const matchesSearch = !search ||
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase()) ||
      s.tags?.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesLang = langFilter === "all" || s.language === langFilter;
    return matchesSearch && matchesLang;
  });

  const sorted = [...filtered].sort((a, b) => (b.is_favorite ? 1 : 0) - (a.is_favorite ? 1 : 0));

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-600/10 border border-red-600/30">
            <FileCode className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Code Snippets</h1>
            <p className="text-sm text-zinc-500">Save, organize, and retrieve reusable code snippets.</p>
          </div>
        </div>
        <Button size="sm" onClick={() => { setEditing(null); setShowForm(true); }}>
          <Plus className="w-3.5 h-3.5" />
          New Snippet
        </Button>
      </div>

      {/* Search & filter */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search snippets..."
            className="w-full rounded-lg border border-zinc-800 bg-zinc-900 pl-9 pr-3 py-2 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-600/50"
          />
        </div>
        <select
          value={langFilter}
          onChange={(e) => setLangFilter(e.target.value)}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-white focus:outline-none focus:border-red-600/50"
        >
          {languages.map((lang) => (
            <option key={lang} value={lang}>{lang === "all" ? "All Languages" : lang}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-5 h-5 text-red-500 animate-spin" />
        </div>
      ) : sorted.length === 0 ? (
        <div className="text-center py-20">
          <FileCode className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
          <p className="text-sm text-zinc-600">
            {search ? "No snippets match your search." : "No snippets yet. Create your first one!"}
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {sorted.map((snippet) => (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}

      {showForm && (
        <SnippetForm
          onSubmit={editing ? handleUpdate : handleCreate}
          onClose={handleCloseForm}
          initial={editing}
        />
      )}
    </div>
  );
}