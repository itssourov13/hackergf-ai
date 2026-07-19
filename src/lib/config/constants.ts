export const APP_CONFIG = {
  name: "Hacker gf",
  tagline: "AI-Powered Development Platform",
  description:
    "A production-ready AI SaaS platform for developers. Chat with AI, write code, execute programs, and manage files — all in one hacker-themed interface.",
  url: "https://hackerai.app",
  supportEmail: "support@hackerai.app",
  version: "1.0.0",
};

export const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "How it Works", href: "/#how-it-works" },
  { label: "Technology", href: "/#technology" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/#faq" },
];

export const SOCIAL_LINKS = {
  github: "https://github.com/hackerai",
  twitter: "https://twitter.com/hackerai",
  discord: "https://discord.gg/hackerai",
};

export const FAQ_ITEMS = [
  {
    question: "What is Hacker gf?",
    answer:
      "Hacker gf is a production-ready AI SaaS platform designed for developers. It combines AI chat, a code editor, secure code execution, and file management into a single hacker-themed interface.",
  },
  {
    question: "Which AI models are supported?",
    answer:
      "Hacker gf supports multiple AI providers including GPT-5, Gemini, and Claude models. The architecture is designed to easily add new providers with minimal changes.",
  },
  {
    question: "Is my code executed securely?",
    answer:
      "Yes. All code execution happens inside isolated sandboxes. Your code never runs on the application server, ensuring security and isolation.",
  },
  {
    question: "Can I upload my own files?",
    answer:
      "Absolutely. Hacker gf supports PDF, DOCX, TXT, Markdown, JSON, CSV, ZIP, images, and source code files. Uploaded content can be used as context for AI analysis.",
  },
  {
    question: "What are the pricing plans?",
    answer:
      "Hacker gf offers Free, Pro, and Team plans. The Free plan includes 50 AI messages per month. Pro and Team plans offer unlimited messages, more storage, and advanced features.",
  },
  {
    question: "Is there an Enterprise plan?",
    answer:
      "Yes, the Enterprise plan offers custom solutions including unlimited storage, SSO/SAML, custom AI models, and dedicated support. Contact us for pricing.",
  },
];

export const FEATURES = [
  {
    icon: "MessageSquare",
    title: "AI Chat",
    description:
      "Streaming AI responses with markdown rendering, syntax highlighting, and multi-provider support including GPT-5, Gemini, and Claude.",
  },
  {
    icon: "Code2",
    title: "Code Editor",
    description:
      "A full-featured IDE-like code editor with multi-tab support, syntax highlighting, auto-save, and AI-powered code suggestions.",
  },
  {
    icon: "Terminal",
    title: "Code Execution",
    description:
      "Secure sandboxed execution for JavaScript, TypeScript, Python, and Bash. View output, runtime errors, and execution logs in real-time.",
  },
  {
    icon: "Upload",
    title: "File Management",
    description:
      "Upload, organize, and process documents. Support for PDF, DOCX, TXT, ZIP, and source code files with automatic content extraction.",
  },
  {
    icon: "Shield",
    title: "Enterprise Security",
    description:
      "JWT-based authentication, role-based access control, rate limiting, and admin override capabilities built into the core architecture.",
  },
  {
    icon: "Zap",
    title: "Background Jobs",
    description:
      "Asynchronous task processing for large file operations, AI post-processing, scheduled cleanup, and usage aggregation.",
  },
];

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Sign In",
    description: "Create an account or sign in to get instant access to the platform.",
    icon: "LogIn",
  },
  {
    step: 2,
    title: "Start Chatting",
    description: "Ask the AI anything. Get streaming responses with code generation and explanations.",
    icon: "MessageSquare",
  },
  {
    step: 3,
    title: "Write & Execute Code",
    description: "Use the built-in editor to write code and run it in a secure sandbox environment.",
    icon: "Play",
  },
  {
    step: 4,
    title: "Upload & Analyze",
    description: "Upload documents and files for AI-powered analysis and context-aware responses.",
    icon: "Upload",
  },
];

export const TECH_STACK = [
  { name: "React", icon: "Atom" },
  { name: "TypeScript", icon: "FileCode" },
  { name: "Tailwind CSS", icon: "Palette" },
  { name: "Base44", icon: "Server" },
  { name: "AI Models", icon: "Brain" },
  { name: "Stripe", icon: "CreditCard" },
];