import { Button } from "@/components/ui/button";

export function StepBookings({ formData, setFormData, nextStep, prevStep }: any) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Bookings & Services</h2>
            <p className="text-muted-foreground text-sm">Set your core offering.</p>

            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium">Primary Service Name</label>
                    <input
                        className="w-full p-2 rounded-md border bg-background"
                        placeholder="e.g. Initial Consultation"
                        value={formData.serviceName || ""}
                        onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Duration (min)</label>
                        <input
                            type="number"
                            className="w-full p-2 rounded-md border bg-background"
                            placeholder="30"
                            value={formData.duration || ""}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">Price ($)</label>
                        <input
                            type="number"
                            className="w-full p-2 rounded-md border bg-background"
                            placeholder="0"
                            value={formData.price || ""}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <div className="flex justify-between">
                <Button variant="ghost" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep}>Continue</Button>
            </div>
        </div>
    )
}
