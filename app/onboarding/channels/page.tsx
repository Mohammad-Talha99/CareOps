"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch"; // Assuming we have or will create a Switch component, or use checkbox for now if not. 
// I will use a simple checkbox if Switch is not available, but let's assume I should make it look good. 
// I'll stick to standard inputs for simplicity unless I check UI library.
// Accessing lucide icons
import { Mail, MessageSquare, Loader2, CheckCircle2 } from "lucide-react";

export default function ChannelsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const businessId = searchParams.get("businessId");

    const [isLoading, setIsLoading] = useState(false);
    const [config, setConfig] = useState({
        emailEnabled: true,
        emailKey: "",
        smsEnabled: false,
        smsKey: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!config.emailEnabled && !config.smsEnabled) {
            alert("You must enable at least one channel.");
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch("/api/onboarding/channels", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    businessId,
                    ...config
                })
            });

            const data = await res.json();

            if (res.ok) {
                // Redirect to Step 3: Services
                router.push(`/onboarding/services?businessId=${businessId}`);
            } else {
                alert(data.error || "Setup failed");
            }
        } catch (error) {
            console.error(error);
            alert("Failed to connect channels");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Setup Communication</CardTitle>
                        <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">Step 2 of 2</span>
                    </div>
                    <CardDescription>Connect your Email and SMS providers to start communicating.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Email Channel */}
                        <div className={`border rounded-lg p-4 transition-colors ${config.emailEnabled ? 'border-primary bg-primary/5' : 'border-border'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-background rounded-full border">
                                        <Mail className="w-5 h-5 text-blue-500" />
                                    </div>
                                    <div>
                                        <div className="font-medium">Email Integration</div>
                                        <div className="text-xs text-muted-foreground">Send confirmations & alerts</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5"
                                        checked={config.emailEnabled}
                                        onChange={(e) => setConfig({ ...config, emailEnabled: e.target.checked })}
                                    />
                                </div>
                            </div>

                            {config.emailEnabled && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                    <Label className="text-xs">API Key (Mock)</Label>
                                    <Input
                                        placeholder="Enter provider key..."
                                        value={config.emailKey}
                                        onChange={(e) => setConfig({ ...config, emailKey: e.target.value })}
                                        className="bg-background"
                                    />
                                    <p className="text-[10px] text-muted-foreground">We'll use a mock provider for verification.</p>
                                </div>
                            )}
                        </div>

                        {/* SMS Channel */}
                        <div className={`border rounded-lg p-4 transition-colors ${config.smsEnabled ? 'border-primary bg-primary/5' : 'border-border'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-background rounded-full border">
                                        <MessageSquare className="w-5 h-5 text-green-500" />
                                    </div>
                                    <div>
                                        <div className="font-medium">SMS Integration</div>
                                        <div className="text-xs text-muted-foreground">Urgent reminders & updates</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        className="h-5 w-5"
                                        checked={config.smsEnabled}
                                        onChange={(e) => setConfig({ ...config, smsEnabled: e.target.checked })}
                                    />
                                </div>
                            </div>

                            {config.smsEnabled && (
                                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                    <Label className="text-xs">API Key (Mock)</Label>
                                    <Input
                                        placeholder="Enter provider key..."
                                        value={config.smsKey}
                                        onChange={(e) => setConfig({ ...config, smsKey: e.target.value })}
                                        className="bg-background"
                                    />
                                </div>
                            )}
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Connect & Finish
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
