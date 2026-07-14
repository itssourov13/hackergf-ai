import React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card, CardContent } from "@/components/ui/card-custom";
import { MessageSquare, Code2, Terminal, Upload, Shield, Zap } from "lucide-react";
import { FEATURES } from "@/lib/config/constants";

const ICON_MAP = {
  MessageSquare,
  Code2,
  Terminal,
  Upload,
  Shield,
  Zap,
};

export default function FeaturesSection() {
  return (
    <Section id="features" className="relative">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Everything you need to build
          </h2>
          <p className="text-zinc-400 text-lg">
            A complete AI development environment with powerful tools integrated
            into a single platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, idx) => {
            const Icon = ICON_MAP[feature.icon] || Code2;
            return (
              <Card
                key={idx}
                className="group hover:border-red-900/60 hover:bg-zinc-900/60 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-600/10 border border-red-600/30 mb-4 group-hover:bg-red-600/20 transition-colors">
                    <Icon className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}