export type PlanId = "free" | "pro" | "team" | "enterprise";

export interface PlanConfig {
  id: PlanId;
  name: string;
  description: string;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  limits: {
    aiMessagesPerMonth: number;
    storageMb: number;
    fileUploads: number;
    codeExecutions: number;
    maxConversations: number;
  };
  highlighted?: boolean;
}

export const PLANS: Record<PlanId, PlanConfig> = {
  free: {
    id: "free",
    name: "Free",
    description: "Perfect for getting started with AI-powered development",
    priceMonthly: 0,
    priceYearly: 0,
    features: [
      "50 AI messages per month",
      "1 GB storage",
      "Basic code editor",
      "Community support",
    ],
    limits: {
      aiMessagesPerMonth: 50,
      storageMb: 1024,
      fileUploads: 100,
      codeExecutions: 25,
      maxConversations: 10,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    description: "For developers who need more power and flexibility",
    priceMonthly: 20,
    priceYearly: 192,
    features: [
      "Unlimited AI messages",
      "25 GB storage",
      "Advanced code editor",
      "Code execution sandbox",
      "File upload & processing",
      "Priority support",
    ],
    limits: {
      aiMessagesPerMonth: -1,
      storageMb: 25600,
      fileUploads: 1000,
      codeExecutions: 500,
      maxConversations: -1,
    },
    highlighted: true,
  },
  team: {
    id: "team",
    name: "Team",
    description: "Collaborate with your team on AI-powered projects",
    priceMonthly: 50,
    priceYearly: 480,
    features: [
      "Everything in Pro",
      "100 GB shared storage",
      "Team collaboration",
      "Shared projects",
      "Admin dashboard",
      "Dedicated support",
    ],
    limits: {
      aiMessagesPerMonth: -1,
      storageMb: 102400,
      fileUploads: 5000,
      codeExecutions: -1,
      maxConversations: -1,
    },
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    description: "Custom solutions for large-scale organizations",
    priceMonthly: -1,
    priceYearly: -1,
    features: [
      "Everything in Team",
      "Unlimited storage",
      "SSO & SAML",
      "Custom AI models",
      "SLA guarantee",
      "Dedicated account manager",
    ],
    limits: {
      aiMessagesPerMonth: -1,
      storageMb: -1,
      fileUploads: -1,
      codeExecutions: -1,
      maxConversations: -1,
    },
  },
};

export const PLAN_LIST = Object.values(PLANS);

export function getPlan(id: string | undefined | null): PlanConfig {
  if (id && id in PLANS) return PLANS[id as PlanId];
  return PLANS.free;
}