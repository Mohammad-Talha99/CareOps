import { Button } from "@/components/ui/button";

export function StepWorkspace({ formData, setFormData, nextStep }: any) {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold">Workspace Setup</h2>
            <p className="text-muted-foreground text-sm">Let's create your digital headquarters.</p>

            <div className="space-y-4">
                <div>
                    <label className="text-sm font-medium">Business Name</label>
                    <input
                        className="w-full p-2 rounded-md border bg-background"
                        placeholder="Acme Inc."
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="text-sm font-medium">Workspace URL</label>
                    <div className="flex">
                        <span className="p-2 border border-r-0 rounded-l-md bg-muted text-muted-foreground text-sm flex items-center">careops.com/</span>
                        <input
                            className="flex-1 p-2 rounded-r-md border bg-background"
                            placeholder="acme"
                            value={formData.slug || ""}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        />
                    </div>
                </div>
                <Button onClick={nextStep} className="w-full">Continue</Button>
            </div>
        </div>
    )
}
