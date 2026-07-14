import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card-custom";
import { Button } from "@/components/ui/button-custom";
import { Badge } from "@/components/ui/badge-custom";
import { Loader2, Check, CreditCard, Zap } from "lucide-react";
import { PLAN_LIST, getPlan } from "@/lib/config/plans";
import { getUserUsage } from "@/lib/usage";

export default function BillingPage() {
  const [subscription, setSubscription] = useState(null);
  const [usage, setUsage] = useState({});
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState("monthly");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [subs, usageData] = await Promise.all([
        base44.entities.Subscription.list("-created_date", 1),
        getUserUsage(),
      ]);
      if (subs.length > 0) {
        setSubscription(subs[0]);
        setBillingCycle(subs[0].billing_cycle || "monthly");
      }
      setUsage(usageData);
    } catch (err) {
      console.error("Failed to load billing data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = async (planId) => {
    if (planId === "free" || planId === "enterprise") return;
    try {
      if (subscription) {
        const updated = await base44.entities.Subscription.update(subscription.id, {
          plan: planId,
          status: "active",
          billing_cycle: billingCycle,
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + (billingCycle === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
        });
        setSubscription(updated);
      } else {
        const created = await base44.entities.Subscription.create({
          plan: planId,
          status: "active",
          billing_cycle: billingCycle,
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + (billingCycle === "yearly" ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
        });
        setSubscription(created);
      }
    } catch (err) {
      console.error("Failed to update subscription:", err);
      alert("Failed to update subscription. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
      </div>
    );
  }

  const currentPlan = getPlan(subscription?.plan);

  const usageItems = [
    { label: "AI Messages", used: usage.ai_messages || 0, limit: currentPlan.limits.aiMessagesPerMonth },
    { label: "File Uploads", used: usage.file_uploads || 0, limit: currentPlan.limits.fileUploads },
    { label: "Code Executions", used: usage.code_executions || 0, limit: currentPlan.limits.codeExecutions },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Billing & Plans</h1>
        <p className="text-sm text-zinc-400">Manage your subscription and view usage.</p>
      </div>

      {/* Current Plan */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-red-500" />
            Current Plan
          </CardTitle>
          <CardDescription>Your active subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-bold text-white">{currentPlan.name}</span>
                <Badge variant="default" className="uppercase">{subscription?.status || "active"}</Badge>
              </div>
              <p className="text-sm text-zinc-400">{currentPlan.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">
                {currentPlan.priceMonthly === 0 ? "$0" : `$${billingCycle === "yearly" ? currentPlan.priceYearly : currentPlan.priceMonthly}`}
              </div>
              <span className="text-sm text-zinc-500">/{billingCycle === "yearly" ? "year" : "month"}</span>
            </div>
          </div>

          {/* Usage */}
          <div className="space-y-4">
            {usageItems.map((item) => {
              const unlimited = item.limit === -1;
              const pct = unlimited ? 0 : item.limit > 0 ? Math.min(100, (item.used / item.limit) * 100) : 0;
              return (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-zinc-400">{item.label}</span>
                    <span className="text-sm text-zinc-300">
                      {item.used} / {unlimited ? "∞" : item.limit}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-red-600 rounded-full transition-all"
                      style={{ width: `${unlimited ? 100 : pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Billing Cycle Toggle */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <button
          onClick={() => setBillingCycle("monthly")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${billingCycle === "monthly" ? "bg-red-600 text-white" : "bg-zinc-900 text-zinc-400 hover:text-white"}`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBillingCycle("yearly")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${billingCycle === "yearly" ? "bg-red-600 text-white" : "bg-zinc-900 text-zinc-400 hover:text-white"}`}
        >
          Yearly
          <span className="ml-1 text-green-400 text-xs">Save 20%</span>
        </button>
      </div>

      {/* Available Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLAN_LIST.filter((p) => p.id !== "enterprise").map((plan) => {
          const isCurrent = subscription?.plan === plan.id;
          return (
            <Card
              key={plan.id}
              className={plan.highlighted ? "border-red-600/50 relative shadow-red-600/10 shadow-2xl" : ""}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1">
                  <Zap className="w-3 h-3 mr-1" /> Popular
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
                      <span className="text-4xl font-bold text-white">
                        ${billingCycle === "yearly" ? plan.priceYearly : plan.priceMonthly}
                      </span>
                      <span className="text-sm text-zinc-500">/{billingCycle === "yearly" ? "year" : "mo"}</span>
                    </div>
                  )}
                </div>
                <Button
                  variant={isCurrent ? "outline" : plan.highlighted ? "default" : "outline"}
                  className="w-full mb-6"
                  disabled={isCurrent}
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  {isCurrent ? (
                    <><Check className="w-4 h-4" /> Current Plan</>
                  ) : (
                    "Choose " + plan.name
                  )}
                </Button>
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
          );
        })}
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-zinc-500">
          Need a custom solution?{" "}
          <span className="text-red-400 font-medium">Contact us for Enterprise pricing</span>
        </p>
      </div>
    </div>
  );
}