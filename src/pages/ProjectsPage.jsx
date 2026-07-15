import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card-custom";
import { Badge } from "@/components/ui/badge-custom";
import { Button } from "@/components/ui/button-custom";
import { useToast } from "@/components/ui/use-toast";
import { FolderGit2, Trash2, Loader2, Code2, FileCode, Calendar } from "lucide-react";

export default function ProjectsPage() {
  const { toast } = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadProjects(); }, []);

  const loadProjects = async () => {
    try {
      const data = await base44.entities.Project.filter({}, "-created_date", 100);
      setProjects(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    try {
      await base44.entities.Project.delete(id);
      setProjects(projects.filter((p) => p.id !== id));
      toast({ title: "Project deleted" });
    } catch (err) { toast({ title: "Failed to delete", description: err.message, variant: "destructive" }); }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-red-600/10 border border-red-600/30"><FolderGit2 className="w-5 h-5 text-red-400" /></div>
          <div>
            <h1 className="text-xl font-bold text-white">Projects</h1>
            <p className="text-sm text-zinc-500">View, edit, or delete your code projects from the editor.</p>
          </div>
        </div>
        <Link to="/editor">
          <Button className="bg-red-600 hover:bg-red-500"><Code2 className="w-4 h-4" /> Open Editor</Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 text-zinc-600 animate-spin" /></div>
      ) : projects.length === 0 ? (
        <Card><CardContent className="py-20 text-center">
          <FolderGit2 className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
          <p className="text-zinc-400 font-medium">No projects yet</p>
          <p className="text-sm text-zinc-600 mt-1 mb-4">Create a project in the code editor to get started.</p>
          <Link to="/editor"><Button className="bg-red-600 hover:bg-red-500"><Code2 className="w-4 h-4" /> Go to Editor</Button></Link>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <Card key={p.id} className="group hover:border-zinc-700 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-zinc-800/60"><FileCode className="w-5 h-5 text-blue-400" /></div>
                  <Button variant="ghost" onClick={() => handleDelete(p.id)} className="opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-red-400 p-1 h-auto">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <Link to="/editor" className="block">
                  <h3 className="font-semibold text-white hover:text-red-400 transition-colors truncate">{p.name}</h3>
                  <p className="text-sm text-zinc-500 mt-1 line-clamp-2 min-h-[2.5rem]">{p.description || "No description"}</p>
                  <div className="flex items-center gap-2 mt-3">
                    {p.language && <Badge variant="secondary">{p.language}</Badge>}
                    {p.is_public && <Badge variant="success">Public</Badge>}
                  </div>
                  <div className="flex items-center gap-1 mt-3 text-xs text-zinc-600">
                    <Calendar className="w-3 h-3" />
                    {new Date(p.created_date).toLocaleDateString()}
                    {p.files?.length > 0 && <span className="ml-2">{p.files.length} files</span>}
                  </div>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}