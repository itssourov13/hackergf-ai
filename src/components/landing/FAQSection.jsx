import React, { useState } from "react";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { ChevronDown } from "lucide-react";
import { FAQ_ITEMS } from "@/lib/config/constants";
import { cn } from "@/lib/utils";

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <Section id="faq">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Frequently asked questions
          </h2>
          <p className="text-zinc-400 text-lg">
            Everything you need to know about Hacker gf.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {FAQ_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-zinc-800 bg-zinc-950/60 overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="flex items-center justify-between w-full p-5 text-left hover:bg-zinc-900/40 transition-colors"
              >
                <span className="text-sm font-medium text-white pr-4">{item.question}</span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-zinc-500 flex-shrink-0 transition-transform",
                    openIdx === idx && "rotate-180 text-red-500"
                  )}
                />
              </button>
              {openIdx === idx && (
                <div className="px-5 pb-5 text-sm text-zinc-400 leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}