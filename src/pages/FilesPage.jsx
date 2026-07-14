import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card-custom";
import { Button } from "@/components/ui/button-custom";
import { Badge } from "@/components/ui/badge-custom";
import { Upload, FileText, Trash2, Search, Loader2, FileCode, Archive, Braces, FileSpreadsheet, Image as ImageIcon, CheckCircle, AlertCircle, RefreshCw } from "lucide-react";
import { UPLOAD_LIMITS, getFileCategory, getMaxSizeForFile, ACCEPTED_EXTENSIONS, GLOBAL_LIMITS } from "@/lib/config/uploadLimits";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS = {
  pdf: FileText,
  docx: FileText,
  text: FileText,
  json: Braces,
  csv: FileSpreadsheet,
  zip: Archive,
  image: ImageIcon,
  code: FileCode,
};

export default function FilesPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const data = await base44.entities.File.list("-created_date", 100);
      setFiles(data);
    } catch (err) {
      console.error("Failed to load files:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    setUploading(true);

    for (const file of Array.from(fileList)) {
      await uploadSingleFile(file);
    }

    setUploading(false);
    loadFiles();
  };

  const uploadSingleFile = async (file) => {
    const category = getFileCategory(file.name);
    if (!category) {
      alert(`Unsupported file type: ${file.name}`);
      return;
    }

    const maxSizeMb = getMaxSizeForFile(file.name);
    if (file.size > maxSizeMb * 1024 * 1024) {
      alert(`File too large: ${file.name}. Max ${maxSizeMb}MB for this file type.`);
      return;
    }

    try {
      // Upload the file
      const { file_url } = await base44.integrations.Core.UploadFile({ file });

      // Create file record
      const fileRecord = await base44.entities.File.create({
        name: file.name,
        file_url,
        file_type: category,
        file_size: file.size,
        mime_type: file.type,
        status: "processing",
      });

      // Try to extract content for text-based files
      if (["pdf", "docx", "text", "json", "csv", "code"].includes(category)) {
        try {
          const result = await base44.integrations.Core.ExtractDataFromUploadedFile({
            file_url,
            json_schema: {
              type: "object",
              properties: {
                content: { type: "string" },
                page_count: { type: "number" },
                word_count: { type: "number" },
                character_count: { type: "number" },
              },
            },
          });

          if (result.status === "success" && result.output) {
            const extracted = result.output;
            await base44.entities.File.update(fileRecord.id, {
              extracted_content: extracted.content || "",
              page_count: extracted.page_count || null,
              word_count: extracted.word_count || 0,
              character_count: extracted.character_count || 0,
              status: "ready",
            });
          } else {
            await base44.entities.File.update(fileRecord.id, { status: "ready" });
          }
        } catch (extractErr) {
          console.error("Extraction failed:", extractErr);
          await base44.entities.File.update(fileRecord.id, {
            status: "ready",
            error_message: "Content extraction failed",
          });
        }
      } else {
        await base44.entities.File.update(fileRecord.id, { status: "ready" });
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert(`Upload failed: ${file.name} - ${err.message}`);
    }
  };

  const deleteFile = async (id) => {
    if (!confirm("Delete this file?")) return;
    try {
      await base44.entities.File.delete(id);
      setFiles(files.filter((f) => f.id !== id));
      if (selectedFile?.id === id) setSelectedFile(null);
    } catch (err) {
      console.error("Failed to delete file:", err);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const filteredFiles = files.filter((f) =>
    f.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">File Manager</h1>
        <p className="text-sm text-zinc-400">Upload, organize, and process documents for AI analysis.</p>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFileSelect(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all mb-6",
          dragOver
            ? "border-red-500 bg-red-950/20"
            : "border-zinc-800 bg-zinc-950/50 hover:border-zinc-700 hover:bg-zinc-900/30"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_EXTENSIONS.map((ext) => `.${ext}`).join(",")}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
            <p className="text-sm text-zinc-400">Uploading and processing...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-600/10 border border-red-600/30">
              <Upload className="w-7 h-7 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Drop files here or click to upload</p>
              <p className="text-xs text-zinc-500 mt-1">
                PDF, DOCX, TXT, MD, JSON, CSV, ZIP, Images, Code — Max {GLOBAL_LIMITS.maxFilesPerUpload} files
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search files..."
          className="w-full sm:max-w-md pl-10 pr-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-900/50"
        />
      </div>

      {/* File Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
          <p className="text-sm text-zinc-500">{search ? "No files found" : "No files uploaded yet"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map((file) => {
            const Icon = CATEGORY_ICONS[file.file_type] || FileText;
            return (
              <Card
                key={file.id}
                className={cn(
                  "cursor-pointer transition-all hover:border-zinc-700",
                  selectedFile?.id === file.id && "border-red-900/50 bg-zinc-900/60"
                )}
                onClick={() => setSelectedFile(file)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800">
                      <Icon className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{file.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-zinc-500">{formatFileSize(file.file_size)}</span>
                        {file.status === "processing" && (
                          <Badge variant="warning" className="text-[10px]">Processing</Badge>
                        )}
                        {file.status === "ready" && (
                          <Badge variant="success" className="text-[10px]">Ready</Badge>
                        )}
                        {file.status === "error" && (
                          <Badge variant="default" className="text-[10px]">Error</Badge>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); deleteFile(file.id); }}
                      className="text-zinc-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {file.extracted_content && (
                    <p className="mt-3 text-xs text-zinc-500 line-clamp-2">
                      {file.extracted_content.slice(0, 150)}...
                    </p>
                  )}
                  {file.word_count > 0 && (
                    <div className="mt-2 flex items-center gap-3 text-[10px] text-zinc-600">
                      <span>{file.word_count} words</span>
                      <span>{file.character_count} chars</span>
                      {file.page_count > 0 && <span>{file.page_count} pages</span>}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* File Detail Panel */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setSelectedFile(null)}>
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-0">
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {React.createElement(CATEGORY_ICONS[selectedFile.file_type] || FileText, { className: "w-5 h-5 text-red-500" })}
                  <h3 className="font-semibold text-white truncate">{selectedFile.name}</h3>
                </div>
                <button onClick={() => setSelectedFile(null)} className="text-zinc-500 hover:text-white text-xl">×</button>
              </div>
              <div className="p-4 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div>
                    <span className="text-zinc-500">Type:</span>
                    <span className="text-zinc-300 ml-2 uppercase">{selectedFile.file_type}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Size:</span>
                    <span className="text-zinc-300 ml-2">{formatFileSize(selectedFile.file_size)}</span>
                  </div>
                  {selectedFile.word_count > 0 && (
                    <div>
                      <span className="text-zinc-500">Words:</span>
                      <span className="text-zinc-300 ml-2">{selectedFile.word_count}</span>
                    </div>
                  )}
                  {selectedFile.page_count > 0 && (
                    <div>
                      <span className="text-zinc-500">Pages:</span>
                      <span className="text-zinc-300 ml-2">{selectedFile.page_count}</span>
                    </div>
                  )}
                </div>
                {selectedFile.extracted_content ? (
                  <div>
                    <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">Extracted Content</p>
                    <pre className="text-sm text-zinc-300 whitespace-pre-wrap bg-zinc-900 rounded-lg p-3 max-h-96 overflow-y-auto border border-zinc-800">
                      {selectedFile.extracted_content.slice(0, 5000)}
                      {selectedFile.extracted_content.length > 5000 && "\n\n... (truncated)"}
                    </pre>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                    <p className="text-sm text-zinc-500">No extracted content available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}