export interface FeatureFlag {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  minPlan: "free" | "pro" | "team" | "enterprise";
  adminOnly?: boolean;
  beta?: boolean;
}

export const FEATURE_FLAGS: Record<string, FeatureFlag> = {
  ai_chat: {
    key: "ai_chat",
    name: "AI Chat",
    description: "AI-powered chat interface with streaming responses",
    enabled: true,
    minPlan: "free",
  },
  code_editor: {
    key: "code_editor",
    name: "Code Editor",
    description: "Web-based code editor with syntax highlighting",
    enabled: true,
    minPlan: "free",
  },
  code_execution: {
    key: "code_execution",
    name: "Code Execution",
    description: "Secure sandboxed code execution environment",
    enabled: true,
    minPlan: "pro",
  },
  file_upload: {
    key: "file_upload",
    name: "File Upload",
    description: "Upload and process documents for AI analysis",
    enabled: true,
    minPlan: "free",
  },
  advanced_models: {
    key: "advanced_models",
    name: "Advanced AI Models",
    description: "Access to premium AI models like Claude Opus and GPT-5",
    enabled: true,
    minPlan: "pro",
  },
  team_collaboration: {
    key: "team_collaboration",
    name: "Team Collaboration",
    description: "Share projects and collaborate with team members",
    enabled: false,
    minPlan: "team",
    beta: true,
  },
  maintenance_mode: {
    key: "maintenance_mode",
    name: "Maintenance Mode",
    description: "Temporarily disable the application for maintenance",
    enabled: false,
    minPlan: "free",
    adminOnly: true,
  },
};

export function isFeatureEnabled(
  key: string,
  userPlan: string = "free",
  isAdmin: boolean = false
): boolean {
  const flag = FEATURE_FLAGS[key];
  if (!flag) return false;
  if (!flag.enabled) return false;
  if (isAdmin) return true;
  const planOrder = ["free", "pro", "team", "enterprise"];
  const userPlanIndex = planOrder.indexOf(userPlan);
  const minPlanIndex = planOrder.indexOf(flag.minPlan);
  return userPlanIndex >= minPlanIndex;
}