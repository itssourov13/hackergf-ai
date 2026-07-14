export type RoleId = "guest" | "user" | "pro" | "team" | "admin";

export interface RoleConfig {
  id: RoleId;
  name: string;
  description: string;
  permissions: string[];
}

export const ROLES: Record<RoleId, RoleConfig> = {
  guest: {
    id: "guest",
    name: "Guest",
    description: "Unauthenticated visitor with limited access",
    permissions: ["view_landing", "view_pricing"],
  },
  user: {
    id: "user",
    name: "User",
    description: "Registered user with free tier access",
    permissions: [
      "view_landing",
      "view_pricing",
      "use_chat",
      "use_editor",
      "upload_files",
      "manage_own_data",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "Pro subscriber with advanced features",
    permissions: [
      "view_landing",
      "view_pricing",
      "use_chat",
      "use_editor",
      "use_code_execution",
      "upload_files",
      "manage_own_data",
      "advanced_models",
    ],
  },
  team: {
    id: "team",
    name: "Team",
    description: "Team member with collaboration features",
    permissions: [
      "view_landing",
      "view_pricing",
      "use_chat",
      "use_editor",
      "use_code_execution",
      "upload_files",
      "manage_own_data",
      "advanced_models",
      "team_collaboration",
      "shared_projects",
    ],
  },
  admin: {
    id: "admin",
    name: "Admin",
    description: "Full system access with override capabilities",
    permissions: [
      "view_landing",
      "view_pricing",
      "use_chat",
      "use_editor",
      "use_code_execution",
      "upload_files",
      "manage_own_data",
      "advanced_models",
      "team_collaboration",
      "shared_projects",
      "manage_users",
      "view_billing",
      "bypass_quotas",
      "bypass_rate_limits",
      "access_all_features",
      "manage_feature_flags",
    ],
  },
};

export function getRole(id: string | undefined | null): RoleConfig {
  if (id && id in ROLES) return ROLES[id as RoleId];
  return ROLES.guest;
}

export function hasPermission(roleId: string | undefined | null, permission: string): boolean {
  const role = getRole(roleId);
  return role.permissions.includes(permission) || role.permissions.includes("access_all_features");
}

export function isAdmin(roleId: string | undefined | null): boolean {
  return roleId === "admin";
}