import React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Atom, FileCode, Palette, Server, Brain, CreditCard } from "lucide-react";
import { TECH_STACK } from "@/lib/config/constants";

const ICON_MAP = {
  Atom,
  FileCode,
  Palette,
  Server,
  Brain,
  CreditCard,
};

export default function TechStackSection() {
  return (
    <Section id="technology">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Powered by modern technology
          </h2>
          <p className="text-zinc-400 text-lg">
            Built on a robust, scalable stack designed for performance and
            developer experience.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {TECH_STACK.map((tech, idx) => {
            const Icon = ICON_MAP[tech.icon] || FileCode;
            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border border-zinc-800 bg-zinc-950/60 hover:border-red-900/50 hover:bg-zinc-900/60 transition-all"
              >
                <Icon className="w-8 h-8 text-red-500" />
                <span className="text-sm font-medium text-zinc-300">{tech.name}</span>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}