import { Button } from "@/components/ui/button";
import { Mail, MessageSquare } from "lucide-react";

export function StepChannels({ formData, setFormData, nextStep, prevStep }: any) {
    const toggleChannel = (channel: string) => {
        const current = formData.channels || [];
        if (current.includes(channel)) {
            setFormData({ ...formData, channels: current.filter((c: string) => c !== channel) });
        } else {
            setFormData({ ...formData, channels: [...current, channel] });
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Communication Channels</h2>
            <p className="text-muted-foreground text-sm">Where should customers reach you?</p>

            <div className="grid grid-cols-2 gap-4">
                <div
                    onClick={() => toggleChannel("Email")}
                    className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center gap-2 hover:bg-muted ${formData.channels?.includes("Email") ? "border-primary bg-primary/5" : ""}`}
                >
                    <Mail className="w-6 h-6" />
                    <span>Email</span>
                </div>
                <div
                    onClick={() => toggleChannel("SMS")}
                    className={`p-4 border rounded-lg cursor-pointer flex flex-col items-center gap-2 hover:bg-muted ${formData.channels?.includes("SMS") ? "border-primary bg-primary/5" : ""}`}
                >
                    <MessageSquare className="w-6 h-6" />
                    <span>SMS</span>
                </div>
            </div>

            <div className="flex justify-between">
                <Button variant="ghost" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep}>Continue</Button>
            </div>
        </div>
    )
}
