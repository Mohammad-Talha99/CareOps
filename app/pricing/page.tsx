import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PricingPage() {
    const plans = [
        {
            name: "Starter",
            price: "$0",
            period: "/month",
            description: "Perfect for solo operators just getting started.",
            features: [
                "Up to 50 bookings/month",
                "Basic Client CRM",
                "Unified Inbox (Email only)",
                "1 User Account",
                "Email Support"
            ],
            cta: "Get Started Free",
            popular: false
        },
        {
            name: "Pro",
            price: "$49",
            period: "/month",
            description: "For growing teams that need automation.",
            features: [
                "Unlimited bookings",
                "Advanced CRM with Notes",
                "Unified Inbox (Email + SMS)",
                "Inventory Management",
                "Up to 5 Team Members",
                "Priority Support"
            ],
            cta: "Start Free Trial",
            popular: true
        },
        {
            name: "Scale",
            price: "$149",
            period: "/month",
            description: "Advanced tools for multi-location businesses.",
            features: [
                "Everything in Pro",
                "Custom Automation Rules",
                "API Access",
                "Dedicated Success Manager",
                "Unlimited Team Members",
                "Multiple Locations"
            ],
            cta: "Contact Sales",
            popular: false
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                        Simple, transparent pricing
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        No hidden fees. Cancel anytime.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-start">
                    {plans.map((plan, idx) => (
                        <div
                            key={idx}
                            className={`relative rounded-2xl border p-8 flex flex-col h-full ${plan.popular
                                    ? "bg-card shadow-xl border-primary scale-105 z-10"
                                    : "bg-background/50 border-border hover:bg-card hover:shadow-lg transition-all"
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-2xl font-bold">{plan.name}</h3>
                                <p className="text-muted-foreground mt-2 text-sm">{plan.description}</p>
                            </div>

                            <div className="mb-6 flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold">{plan.price}</span>
                                <span className="text-muted-foreground">{plan.period}</span>
                            </div>

                            <Button
                                variant={plan.popular ? "default" : "outline"}
                                className={`w-full mb-8 font-semibold ${plan.popular ? "shadow-lg shadow-primary/20" : ""}`}
                            >
                                {plan.cta}
                            </Button>

                            <div className="space-y-4 flex-1">
                                {plan.features.map((feature, i) => (
                                    <div key={i} className="flex items-start gap-3 text-sm">
                                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                            <Check className="w-3 h-3 text-primary" />
                                        </div>
                                        <span className="text-muted-foreground">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <p className="text-muted-foreground">
                        Have custom requirements? <a href="/contact" className="text-primary font-medium hover:underline">Talk to our enterprise team</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}
