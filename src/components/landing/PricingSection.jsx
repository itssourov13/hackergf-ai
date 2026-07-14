import React from "react";
import { Link } from "react-router-dom";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card-custom";
import { Button } from "@/components/ui/button-custom";
import { Badge } from "@/components/ui/badge-custom";
import { Check } from "lucide-react";
import { PLAN_LIST } from "@/lib/config/plans";

export default function PricingSection() {
  return (
    <Section id="pricing" className="bg-zinc-950/50">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-zinc-400 text-lg">
            Start free. Upgrade when you need more. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLAN_LIST.filter((p) => p.id !== "enterprise").map((plan) => (
            <Card
              key={plan.id}
              className={
                plan.highlighted
                  ? "border-red-600/50 bg-zinc-900/80 relative shadow-red-600/10 shadow-2xl"
                  : ""
              }
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  {plan.priceMonthly === 0 ? (
                    <span className="text-4xl font-bold text-white">$0</span>
                  ) : (
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-white">${plan.priceMonthly}</span>
                      <span className="text-sm text-zinc-500">/mo</span>
                    </div>
                  )}
                </div>
                <Link to="/register" className="block">
                  <Button
                    variant={plan.highlighted ? "default" : "outline"}
                    className="w-full mb-6"
                  >
                    {plan.id === "free" ? "Get Started" : "Choose " + plan.name}
                  </Button>
                </Link>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-zinc-400">
                      <Check className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-zinc-500">
            Need a custom solution?{" "}
            <span className="text-red-400 font-medium">Contact us for Enterprise pricing</span>
          </p>
        </div>
      </Container>
    </Section>
  );
}