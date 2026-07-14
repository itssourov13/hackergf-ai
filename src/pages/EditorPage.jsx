import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button-custom";
import { Card, CardContent } from "@/components/ui/card-custom";
import { Plus, FileCode, Trash2, Save, FilePlus, Loader2, Terminal, Play, X, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_FILES = [
  {
    name: "main.js",
    language: "javascript",
    content: "// Welcome to HackerAI Code Editor\n// Start coding here...\n\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet('HackerAI'));\n",
  },
];

const LANGUAGE_OPTIONS = [
  { label: "JavaScript", value: "javascript", ext: "js" },
  { label: "TypeScript", value: "typescript", ext: "ts" },
  { label: "Python", value: "python", ext: "py" },
  { label: "HTML", value: "html", ext: "html" },
  { label: "CSS", value: "css", ext: "css" },
  { label: "JSON", value: "json", ext: "json" },
  { label: "Markdown", value: "markdown", ext: "md" },
  { label: "Bash", value: "bash", ext: "sh" },
];

export default function EditorPage() {
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [files, setFiles] = useState([]);
  const [activeFileIdx, setActiveFileIdx] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showNewFile, setShowNewFile] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newFileLang, setNewFileLang] = useState("javascript");
  const [saving, setSaving] = useState(false);
  const [showTerminal, setShowTerminal] = useState(false);
  const [terminalOutput, setTerminalOutput] = useState([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await base44.entities.Project.list("-updated_date", 50);
      setProjects(data);
      if (data.length > 0) {
        setActiveProject(data[0]);
        setFiles(data[0].files || DEFAULT_FILES);
      } else {
        setFiles(DEFAULT_FILES);
      }
    } catch (err) {
      console.error("Failed to load projects:", err);
      setFiles(DEFAULT_FILES);
    } finally {
      setLoading(false);
    }
  };

  const activeFile = files[activeFileIdx];

  const handleContentChange = (value) => {
    const newFiles = [...files];
    newFiles[activeFileIdx] = { ...newFiles[activeFileIdx], content: value, is_unsaved: true };
    setFiles(newFiles);
  };

  const handleSave = async () => {
    if (!activeProject) {
      // Create a new project
      try {
        const newProject = await base44.entities.Project.create({
          name: "Untitled Project",
          language: "javascript",
          files: files.map((f) => ({ ...f, is_unsaved: false })),
        });
        setActiveProject(newProject);
        setProjects([newProject, ...projects]);
      } catch (err) {
        console.error("Failed to create project:", err);
      }
      return;
    }

    setSaving(true);
    try {
      const updatedFiles = files.map((f) => ({ ...f, is_unsaved: false }));
      await base44.entities.Project.update(activeProject.id, { files: updatedFiles });
      setFiles(updatedFiles);
      setProjects(projects.map((p) => (p.id === activeProject.id ? { ...p, files: updatedFiles } : p)));
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  };

  const createNewFile = () => {
    const ext = LANGUAGE_OPTIONS.find((l) => l.value === newFileLang)?.ext || "txt";
    const name = newFileName.includes(".") ? newFileName : `${newFileName}.${ext}`;
    if (files.some((f) => f.name === name)) {
      alert("A file with this name already exists");
      return;
    }
    const newFile = { name, language: newFileLang, content: "", is_unsaved: false };
    setFiles([...files, newFile]);
    setActiveFileIdx(files.length);
    setShowNewFile(false);
    setNewFileName("");
  };

  const deleteFile = (idx) => {
    if (!confirm("Delete this file?")) return;
    const newFiles = files.filter((_, i) => i !== idx);
    setFiles(newFiles);
    if (activeFileIdx >= newFiles.length) {
      setActiveFileIdx(Math.max(0, newFiles.length - 1));
    }
  };

  const runCode = () => {
    if (!activeFile) return;
    setShowTerminal(true);
    setTerminalOutput([{ type: "info", text: `> Running ${activeFile.name}...` }]);

    // Simulated execution (Phase 6 will integrate real sandbox)
    setTimeout(() => {
      if (activeFile.language === "javascript") {
        try {
          // Capture console.log output
          const logs = [];
          const fakeConsole = {
            log: (...args) => logs.push(args.map(String).join(" ")),
            error: (...args) => logs.push("Error: " + args.map(String).join(" ")),
            warn: (...args) => logs.push("Warning: " + args.map(String).join(" ")),
          };
          const fn = new Function("console", activeFile.content);
          fn(fakeConsole);
          setTerminalOutput([
            { type: "info", text: `> Running ${activeFile.name}...` },
            ...logs.map((log) => ({ type: "output", text: log })),
            { type: "success", text: "✓ Execution completed" },
          ]);
        } catch (err) {
          setTerminalOutput([
            { type: "info", text: `> Running ${activeFile.name}...` },
            { type: "error", text: `✗ ${err.message}` },
          ]);
        }
      } else {
        setTerminalOutput([
          { type: "info", text: `> Running ${activeFile.name}...` },
          { type: "error", text: `✗ Code execution for ${activeFile.language} requires the sandbox environment (Phase 6)` },
        ]);
      }
    }, 500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-zinc-950">
      {/* Editor Header */}
      <div className="flex items-center justify-between h-12 px-4 border-b border-zinc-800 bg-black">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="p-1 text-zinc-400 hover:text-white rounded" title="Dashboard">
            <LayoutDashboard className="w-4 h-4" />
          </Link>
          <FileCode className="w-4 h-4 text-red-500" />
          <span className="text-sm font-semibold text-white">
            {activeProject?.name || "Untitled Project"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowNewFile(true)}>
            <FilePlus className="w-4 h-4" /> New File
          </Button>
          <Button variant="ghost" size="sm" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
          </Button>
          <Button size="sm" onClick={runCode}>
            <Play className="w-4 h-4" /> Run
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* File Tabs */}
        <div className="w-48 flex-col border-r border-zinc-800 bg-black hidden sm:flex">
          <div className="p-2 border-b border-zinc-800">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide px-2">Files</span>
          </div>
          <div className="flex-1 overflow-y-auto p-1">
            {files.map((file, idx) => (
              <div
                key={idx}
                onClick={() => setActiveFileIdx(idx)}
                className={cn(
                  "group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors",
                  activeFileIdx === idx
                    ? "bg-red-600/10 text-red-400"
                    : "text-zinc-400 hover:bg-zinc-900"
                )}
              >
                <FileCode className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="flex-1 text-xs truncate">{file.name}</span>
                {file.is_unsaved && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 flex-shrink-0" />}
                <button
                  onClick={(e) => { e.stopPropagation(); deleteFile(idx); }}
                  className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col">
          {/* Tab Bar */}
          <div className="flex items-center h-9 border-b border-zinc-800 bg-black overflow-x-auto">
            {files.map((file, idx) => (
              <button
                key={idx}
                onClick={() => setActiveFileIdx(idx)}
                className={cn(
                  "flex items-center gap-2 px-3 h-full text-xs font-medium border-r border-zinc-800 whitespace-nowrap transition-colors",
                  activeFileIdx === idx
                    ? "bg-zinc-950 text-white border-t-2 border-t-red-500"
                    : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300"
                )}
              >
                {file.name}
                {file.is_unsaved && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />}
              </button>
            ))}
          </div>

          {/* Code Textarea (simplified editor) */}
          <div className="flex-1 relative overflow-hidden">
            <textarea
              value={activeFile?.content || ""}
              onChange={(e) => handleContentChange(e.target.value)}
              spellCheck={false}
              className="w-full h-full bg-zinc-950 text-zinc-100 font-mono text-sm p-4 resize-none focus:outline-none leading-relaxed"
              style={{ tabSize: 2 }}
              placeholder="// Start coding..."
            />
          </div>

          {/* Terminal */}
          {showTerminal && (
            <div className="h-48 border-t border-zinc-800 bg-black flex flex-col">
              <div className="flex items-center justify-between h-8 px-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-red-500" />
                  <span className="text-xs font-medium text-zinc-400">Terminal</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTerminalOutput([])}
                    className="text-xs text-zinc-500 hover:text-white"
                  >
                    Clear
                  </button>
                  <button onClick={() => setShowTerminal(false)} className="text-zinc-500 hover:text-white">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-3 font-mono text-xs space-y-1">
                {terminalOutput.length === 0 ? (
                  <span className="text-zinc-600">Terminal ready. Click "Run" to execute code.</span>
                ) : (
                  terminalOutput.map((line, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        line.type === "error" && "text-red-400",
                        line.type === "success" && "text-green-400",
                        line.type === "info" && "text-blue-400",
                        line.type === "output" && "text-zinc-300"
                      )}
                    >
                      {line.text}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New File Modal */}
      {showNewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowNewFile(false)}>
          <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">New File</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-zinc-400 mb-1 block">File Name</label>
                  <input
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="myfile"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-900/50"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-sm text-zinc-400 mb-1 block">Language</label>
                  <select
                    value={newFileLang}
                    onChange={(e) => setNewFileLang(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white focus:outline-none focus:border-red-900/50"
                  >
                    {LANGUAGE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setShowNewFile(false)}>Cancel</Button>
                  <Button size="sm" onClick={createNewFile} disabled={!newFileName.trim()}>Create</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}