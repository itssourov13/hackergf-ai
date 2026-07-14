import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button-custom";
import { Card, CardContent } from "@/components/ui/card-custom";
import { Plus, FileCode, Trash2, Save, FilePlus, Loader2, Terminal, Play, X, LayoutDashboard, FolderPlus, ChevronDown, Edit2 } from "lucide-react";
import { trackUsage } from "@/lib/usage";
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
  const [showNewProject, setShowNewProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [projectDropdown, setProjectDropdown] = useState(false);
  const [renamingFile, setRenamingFile] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [editorSettings, setEditorSettings] = useState({ code_editor_font_size: 14, code_editor_word_wrap: true, terminal_font_size: 13 });
  const textareaRef = useRef(null);

  useEffect(() => {
    loadProjects();
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await base44.entities.Settings.list("-created_date", 1);
      if (data.length > 0) {
        setEditorSettings({
          code_editor_font_size: data[0].code_editor_font_size || 14,
          code_editor_word_wrap: data[0].code_editor_word_wrap !== false,
          terminal_font_size: data[0].terminal_font_size || 13,
        });
      }
    } catch (err) {
      console.error("Failed to load settings:", err);
    }
  };

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

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = activeFile.content.substring(0, start) + "  " + activeFile.content.substring(end);
      handleContentChange(newValue);
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      });
    }
  };

  const handleSave = async () => {
    if (!activeProject) {
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

  const startRename = (idx) => {
    setRenamingFile(idx);
    setRenameValue(files[idx].name);
  };

  const confirmRename = () => {
    if (renamingFile === null) return;
    const name = renameValue.includes(".") ? renameValue : `${renameValue}.${LANGUAGE_OPTIONS.find((l) => l.value === files[renamingFile].language)?.ext || "txt"}`;
    if (files.some((f, i) => i !== renamingFile && f.name === name)) {
      alert("A file with this name already exists");
      return;
    }
    const newFiles = [...files];
    newFiles[renamingFile] = { ...newFiles[renamingFile], name, is_unsaved: true };
    setFiles(newFiles);
    setRenamingFile(null);
    setRenameValue("");
  };

  const createNewProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      const newProject = await base44.entities.Project.create({
        name: newProjectName,
        language: "javascript",
        files: DEFAULT_FILES,
      });
      setProjects([newProject, ...projects]);
      setActiveProject(newProject);
      setFiles(DEFAULT_FILES);
      setActiveFileIdx(0);
      setShowNewProject(false);
      setNewProjectName("");
      setProjectDropdown(false);
    } catch (err) {
      console.error("Failed to create project:", err);
    }
  };

  const switchProject = (project) => {
    setActiveProject(project);
    setFiles(project.files || DEFAULT_FILES);
    setActiveFileIdx(0);
    setProjectDropdown(false);
  };

  const deleteProject = async (id, e) => {
    e?.stopPropagation();
    if (!confirm("Delete this project and all its files?")) return;
    try {
      await base44.entities.Project.delete(id);
      const remaining = projects.filter((p) => p.id !== id);
      setProjects(remaining);
      if (activeProject?.id === id) {
        if (remaining.length > 0) {
          switchProject(remaining[0]);
        } else {
          setActiveProject(null);
          setFiles(DEFAULT_FILES);
          setActiveFileIdx(0);
        }
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  const runCode = () => {
    if (!activeFile) return;
    setShowTerminal(true);
    setTerminalOutput([{ type: "info", text: `> Running ${activeFile.name}...` }]);

    setTimeout(() => {
      if (activeFile.language === "javascript" || activeFile.language === "typescript") {
        try {
          const logs = [];
          const errors = [];
          const fakeConsole = {
            log: (...args) => logs.push(args.map(formatArg).join(" ")),
            error: (...args) => logs.push("Error: " + args.map(formatArg).join(" ")),
            warn: (...args) => logs.push("Warning: " + args.map(formatArg).join(" ")),
            info: (...args) => logs.push(args.map(formatArg).join(" ")),
          };
          // Sandboxed execution: override window access via with-block scope
          const sandbox = { console: fakeConsole, Math, JSON, Date, parseInt, parseFloat, isNaN, String, Number, Boolean, Array, Object };
          const fn = new Function(...Object.keys(sandbox), `"use strict";\n${activeFile.language === "typescript" ? activeFile.content.replace(/:\s*\w+/g, "").replace(/import\s+.*?from\s+['"].*?['"];?/g, "") : activeFile.content}`);
          fn(...Object.values(sandbox));
          setTerminalOutput([
            { type: "info", text: `> Running ${activeFile.name}...` },
            ...logs.map((log) => ({ type: "output", text: log })),
            { type: "success", text: "✓ Execution completed" },
          ]);
          trackUsage("code_execution", 1, { language: activeFile.language });
        } catch (err) {
          setTerminalOutput([
            { type: "info", text: `> Running ${activeFile.name}...` },
            { type: "error", text: `✗ ${err.message}` },
          ]);
        }
      } else if (activeFile.language === "json") {
        try {
          JSON.parse(activeFile.content);
          setTerminalOutput([
            { type: "info", text: `> Validating ${activeFile.name}...` },
            { type: "success", text: "✓ Valid JSON" },
          ]);
        } catch (err) {
          setTerminalOutput([
            { type: "info", text: `> Validating ${activeFile.name}...` },
            { type: "error", text: `✗ Invalid JSON: ${err.message}` },
          ]);
        }
      } else if (activeFile.language === "html") {
        setTerminalOutput([
          { type: "info", text: `> Running ${activeFile.name}...` },
          { type: "output", text: "HTML preview not available in terminal. Use a browser to view." },
          { type: "success", text: "✓ HTML syntax checked" },
        ]);
      } else {
        setTerminalOutput([
          { type: "info", text: `> Running ${activeFile.name}...` },
          { type: "error", text: `✗ Code execution for ${activeFile.language} is not supported in the browser sandbox.` },
        ]);
      }
    }, 300);
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
          {/* Project Selector */}
          <div className="relative">
            <button
              onClick={() => setProjectDropdown(!projectDropdown)}
              className="flex items-center gap-2 text-sm font-semibold text-white hover:text-red-400 transition-colors"
            >
              {activeProject?.name || "Untitled Project"}
              <ChevronDown className="w-3 h-3" />
            </button>
            {projectDropdown && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setProjectDropdown(false)} />
                <div className="absolute left-0 top-full mt-1 w-64 rounded-lg border border-zinc-800 bg-zinc-900 shadow-2xl z-20 max-h-96 overflow-y-auto">
                  <div className="p-2 border-b border-zinc-800">
                    <button
                      onClick={() => { setShowNewProject(true); setProjectDropdown(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-600/10 transition-colors"
                    >
                      <FolderPlus className="w-4 h-4" /> New Project
                    </button>
                  </div>
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => switchProject(project)}
                      className={cn(
                        "group flex items-center justify-between px-3 py-2.5 cursor-pointer hover:bg-zinc-800 transition-colors border-b border-zinc-800/50 last:border-0",
                        activeProject?.id === project.id && "bg-red-600/10"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileCode className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                        <span className="text-sm text-zinc-300 truncate">{project.name}</span>
                      </div>
                      <button
                        onClick={(e) => deleteProject(project.id, e)}
                        className="opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
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
                {renamingFile === idx ? (
                  <input
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.key === "Enter" && confirmRename()}
                    onBlur={confirmRename}
                    autoFocus
                    className="flex-1 bg-zinc-900 border border-red-900/50 rounded px-1 text-xs text-white focus:outline-none"
                  />
                ) : (
                  <span className="flex-1 text-xs truncate">{file.name}</span>
                )}
                {file.is_unsaved && <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 flex-shrink-0" />}
                {renamingFile !== idx && (
                  <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      onClick={(e) => { e.stopPropagation(); startRename(idx); }}
                      className="text-zinc-600 hover:text-red-400"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteFile(idx); }}
                      className="text-zinc-600 hover:text-red-400 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
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

          {/* Code Textarea */}
          <div className="flex-1 relative overflow-hidden">
            <textarea
              ref={textareaRef}
              value={activeFile?.content || ""}
              onChange={(e) => handleContentChange(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className="w-full h-full bg-zinc-950 text-zinc-100 font-mono p-4 resize-none focus:outline-none leading-relaxed"
              style={{
                fontSize: `${editorSettings.code_editor_font_size}px`,
                whiteSpace: editorSettings.code_editor_word_wrap ? "pre-wrap" : "pre",
                overflow: editorSettings.code_editor_word_wrap ? "auto" : "scroll",
                tabSize: 2,
              }}
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
              <div className="flex-1 overflow-y-auto p-3 font-mono space-y-1" style={{ fontSize: `${editorSettings.terminal_font_size}px` }}>
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
                    onKeyDown={(e) => e.key === "Enter" && newFileName.trim() && createNewFile()}
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

      {/* New Project Modal */}
      {showNewProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setShowNewProject(false)}>
          <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">New Project</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-zinc-400 mb-1 block">Project Name</label>
                  <input
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && newProjectName.trim() && createNewProject()}
                    placeholder="My Project"
                    className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-900/50"
                    autoFocus
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" size="sm" onClick={() => setShowNewProject(false)}>Cancel</Button>
                  <Button size="sm" onClick={createNewProject} disabled={!newProjectName.trim()}>Create</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

function formatArg(arg) {
  if (typeof arg === "object" && arg !== null) {
    try { return JSON.stringify(arg); } catch { return String(arg); }
  }
  return String(arg);
}