export interface FileLimitConfig {
  extensions: string[];
  maxSizeMb: number;
  icon: string;
  label: string;
}

export const UPLOAD_LIMITS: Record<string, FileLimitConfig> = {
  pdf: {
    extensions: ["pdf"],
    maxSizeMb: 100,
    icon: "FileText",
    label: "PDF Document",
  },
  docx: {
    extensions: ["docx", "doc"],
    maxSizeMb: 50,
    icon: "FileText",
    label: "Word Document",
  },
  text: {
    extensions: ["txt", "md", "markdown"],
    maxSizeMb: 20,
    icon: "FileText",
    label: "Text File",
  },
  json: {
    extensions: ["json"],
    maxSizeMb: 10,
    icon: "Braces",
    label: "JSON File",
  },
  csv: {
    extensions: ["csv"],
    maxSizeMb: 10,
    icon: "FileSpreadsheet",
    label: "CSV File",
  },
  zip: {
    extensions: ["zip"],
    maxSizeMb: 250,
    icon: "Archive",
    label: "ZIP Archive",
  },
  image: {
    extensions: ["png", "jpg", "jpeg", "gif", "webp", "svg"],
    maxSizeMb: 25,
    icon: "Image",
    label: "Image File",
  },
  code: {
    extensions: ["js", "ts", "tsx", "jsx", "py", "html", "css", "java", "go", "rs", "cpp", "c", "rb", "php", "sh", "sql"],
    maxSizeMb: 10,
    icon: "Code",
    label: "Source Code",
  },
};

export const GLOBAL_LIMITS = {
  maxProjectUploadMb: 500,
  maxFilesPerUpload: 500,
};

export const ACCEPTED_EXTENSIONS = Object.values(UPLOAD_LIMITS).flatMap((c) => c.extensions);

export function getFileCategory(filename: string): string | null {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (!ext) return null;
  for (const [category, config] of Object.entries(UPLOAD_LIMITS)) {
    if (config.extensions.includes(ext)) return category;
  }
  return null;
}

export function getMaxSizeForFile(filename: string): number {
  const category = getFileCategory(filename);
  if (!category) return 10;
  return UPLOAD_LIMITS[category].maxSizeMb;
}