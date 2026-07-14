import React from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { LogIn, MessageSquare, Play, Upload } from "lucide-react";
import { HOW_IT_WORKS } from "@/lib/config/constants";

const ICON_MAP = {
  LogIn,
  MessageSquare,
  Play,
  Upload,
};

export default function HowItWorksSection() {
  return (
    <Section id="how-it-works" className="bg-zinc-950/50">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            How it works
          </h2>
          <p className="text-zinc-400 text-lg">
            Get up and running in minutes. No complex setup required.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {HOW_IT_WORKS.map((item) => {
            const Icon = ICON_MAP[item.icon] || MessageSquare;
            return (
              <div key={item.step} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-red-600/10 border border-red-600/30 mb-4">
                    <Icon className="w-7 h-7 text-red-500" />
                    <span className="absolute -top-2 -right-2 flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>
                {item.step < HOW_IT_WORKS.length && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-full h-px bg-gradient-to-r from-red-900/40 to-transparent" />
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}