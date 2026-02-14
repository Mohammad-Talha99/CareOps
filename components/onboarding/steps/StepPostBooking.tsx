import { Button } from "@/components/ui/button";

export function StepPostBooking({ formData, setFormData, nextStep, prevStep }: any) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Post-Booking Flow</h2>
            <p className="text-muted-foreground text-sm">What happens after they book?</p>

            <div className="space-y-4">
                <label className="flex items-center gap-2 p-4 border rounded-md cursor-pointer hover:bg-muted">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300"
                        checked={formData.sendConfirmation || false}
                        onChange={(e) => {
                            // Handle checkbox change manually to ensure boolean
                            const checked = e.target.checked;
                            setFormData({ ...formData, sendConfirmation: checked });
                        }}
                    />
                    <div className="flex-1">
                        <div className="font-medium">Send Confirmation Email</div>
                        <div className="text-xs text-muted-foreground">Automatically send details to client</div>
                    </div>
                </label>

                <label className="flex items-center gap-2 p-4 border rounded-md cursor-pointer hover:bg-muted">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300"
                        checked={formData.askFeedback || false}
                        onChange={(e) => {
                            const checked = e.target.checked;
                            setFormData({ ...formData, askFeedback: checked });
                        }}
                    />
                    <div className="flex-1">
                        <div className="font-medium">Request Feedback</div>
                        <div className="text-xs text-muted-foreground">Send a survey after service completion</div>
                    </div>
                </label>
            </div>

            <div className="flex justify-between">
                <Button variant="ghost" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep}>Continue</Button>
            </div>
        </div>
    )
}
