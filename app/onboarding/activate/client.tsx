"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle, Rocket } from "lucide-react";
import Link from "next/link";

function ActivateContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const businessId = searchParams.get("businessId");

    const [isLoading, setIsLoading] = useState(true);
    const [isActivating, setIsActivating] = useState(false);
    const [checks, setChecks] = useState({
        hasServices: false,
        hasIntegrations: false,
        hasAvailability: false
    });
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (businessId) {
            validateWorkspace();
        }
    }, [businessId]);

    const validateWorkspace = async () => {
        try {
            const res = await fetch(`/api/onboarding/activate?businessId=${businessId}`);
            const data = await res.json();
            if (data.checks) {
                setChecks(data.checks);
                setIsReady(data.ready);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleActivate = async () => {
        setIsActivating(true);
        try {
            const res = await fetch("/api/onboarding/activate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ businessId })
            });

            if (res.ok) {
                router.push("/dashboard");
            } else {
                alert("Failed to activate workspace");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsActivating(false);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">Final Review</CardTitle>
                    <CardDescription className="text-center">
                        Let's verify your workspace is ready to go live.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    <div className="space-y-3">
                        <CheckItem
                            label="Services Configured"
                            isValid={checks.hasServices}
                            link={`/onboarding/services?businessId=${businessId}`}
                        />
                        <CheckItem
                            label="Communication Channels"
                            isValid={checks.hasIntegrations}
                            link={`/onboarding/channels?businessId=${businessId}`}
                        />
                        <CheckItem
                            label="Availability Set"
                            isValid={checks.hasAvailability}
                            link={`/onboarding/availability?businessId=${businessId}`}
                        />
                    </div>

                    <div className="pt-6">
                        {isReady ? (
                            <Button size="lg" className="w-full text-lg gap-2" onClick={handleActivate} disabled={isActivating}>
                                {isActivating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Rocket className="w-5 h-5" />}
                                Activate Workspace
                            </Button>
                        ) : (
                            <Button size="lg" variant="secondary" className="w-full" disabled>
                                Complete Steps to Activate
                            </Button>
                        )}
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}

function CheckItem({ label, isValid, link }: { label: string, isValid: boolean, link: string }) {
    return (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-background">
            <div className="flex items-center gap-3">
                {isValid ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                )}
                <span className={isValid ? "font-medium" : "font-medium text-muted-foreground"}>{label}</span>
            </div>
            {!isValid && (
                <Link href={link} className="text-sm text-primary hover:underline">
                    Fix This
                </Link>
            )}
        </div>
    );
}

export default function ActivatePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
            <ActivateContent />
        </Suspense>
    );
}
