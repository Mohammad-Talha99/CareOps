import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export function StepStaff({ formData, setFormData, nextStep, prevStep }: any) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Team Setup</h2>
            <p className="text-muted-foreground text-sm">Invite members to your workspace.</p>

            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <input
                        className="flex-1 p-2 rounded-md border bg-background"
                        placeholder="colleague@example.com"
                    />
                    <Button variant="outline"><UserPlus className="w-4 h-4" /></Button>
                </div>
                <p className="text-xs text-muted-foreground">We'll send them an invite link once your workspace is live.</p>
            </div>

            <div className="flex justify-between">
                <Button variant="ghost" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep}>Continue</Button>
            </div>
        </div>
    )
}
