import { Button } from "@/components/ui/button";

export function StepResources({ formData, setFormData, nextStep, prevStep }: any) {
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">Resources & Inventory</h2>
            <p className="text-muted-foreground text-sm">Track materials and room availability.</p>

            <div className="space-y-4">
                <label className="flex items-center gap-2 p-4 border rounded-md cursor-pointer hover:bg-muted">
                    <input type="checkbox" className="w-5 h-5 rounded border-gray-300"
                        checked={formData.trackInventory || false}
                        onChange={(e) => setFormData({ ...formData, trackInventory: e.target.checked })}
                    />
                    <div className="flex-1">
                        <div className="font-medium">Enable Inventory Tracking</div>
                        <div className="text-xs text-muted-foreground">Monitor stock levels for products</div>
                    </div>
                </label>

                {formData.trackInventory && (
                    <div className="pl-6 border-l-2 space-y-2">
                        <label className="text-sm font-medium">Low Stock Threshold</label>
                        <input
                            type="number"
                            className="w-full p-2 rounded-md border bg-background"
                            placeholder="5"
                            value={formData.lowStockThreshold || ""}
                            onChange={(e) => setFormData({ ...formData, lowStockThreshold: e.target.value })}
                        />
                    </div>
                )}
            </div>

            <div className="flex justify-between">
                <Button variant="ghost" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep}>Continue</Button>
            </div>
        </div>
    )
}
