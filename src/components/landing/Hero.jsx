import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button-custom";
import { Badge } from "@/components/ui/badge-custom";
import { Terminal, ArrowRight, Sparkles, Zap, LayoutDashboard } from "lucide-react";
import { APP_CONFIG } from "@/lib/config/constants";

export default function Hero() {
  const { isAuthenticated } = useAuth();
  return (
    <Section className="relative overflow-hidden pt-32 pb-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-900/10 rounded-full blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <Container className="relative">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <Badge variant="default" className="mb-6 px-4 py-1.5">
            <Sparkles className="w-3 h-3 mr-1.5" />
            {APP_CONFIG.tagline}
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.1] mb-6">
            The AI Platform for
            <br />
            <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
              Elite Developers
            </span>
          </h1>

          <p className="text-lg text-zinc-400 max-w-2xl mb-8 leading-relaxed">
            Chat with AI, write code in a full-featured editor, execute programs
            in secure sandboxes, and manage files — all in one hacker-themed
            interface built for production.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button size="lg" className="group">
                  <LayoutDashboard className="w-4 h-4" />
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            ) : (
              <Link to="/register">
                <Button size="lg" className="group">
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            )}
            {!isAuthenticated && (
              <Link to="/login">
                <Button variant="outline" size="lg">
                  <Terminal className="w-4 h-4" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-12 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-500" />
              No credit card required
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-500" />
              50 free AI messages
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-red-500" />
              Cancel anytime
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}