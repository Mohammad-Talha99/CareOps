import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function StepActivation({ formData, prevStep }: any) {
    const [isActivating, setIsActivating] = useState(false);
    const [isDone, setIsDone] = useState(false);

    const handleActivation = () => {
        setIsActivating(true);
        // Simulate API call
        setTimeout(() => {
            setIsActivating(false);
            setIsDone(true);
        }, 2000);
    };

    if (isDone) {
        return (
            <div className="text-center py-8 space-y-6">
                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold">Workspace Ready!</h2>
                <p className="text-muted-foreground">Your CareOps environment is fully configured.</p>
                <Link href="/dashboard">
                    <Button className="w-full mt-4" size="lg">Enter Dashboard</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Review & Activate</h2>
            <p className="text-muted-foreground text-sm">Review your settings before launching.</p>

            <div className="bg-muted/50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Business:</span>
                    <span className="font-medium">{formData.name}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Service:</span>
                    <span className="font-medium">{formData.serviceName} (${formData.price})</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Channels:</span>
                    <span className="font-medium">{formData.channels?.join(", ")}</span>
                </div>
            </div>

            <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={prevStep} disabled={isActivating}>Back</Button>
                <Button onClick={handleActivation} disabled={isActivating}>
                    {isActivating ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Activating...</> : "Launch Workspace"}
                </Button>
            </div>
        </div>
    )
}
