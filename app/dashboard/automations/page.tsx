import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Plus, ArrowRight } from "lucide-react";

const AUTOMATIONS = [
    { id: 1, name: "Booking Confirmation", trigger: "New Booking Created", action: "Send Email to Customer", active: true },
    { id: 2, name: "Low Stock Alert", trigger: "Inventory < Threshold", action: "Send SMS to Owner", active: true },
    { id: 3, name: "Review Request", trigger: "Booking Completed (24h)", action: "Send Feedback Form", active: false },
];

export default function AutomationsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Automations</h2>
                    <p className="text-muted-foreground">Streamline your operations with rules.</p>
                </div>
                <Button>
                    <Plus className="w-4 h-4 mr-2" /> New Rule
                </Button>
            </div>

            <div className="grid gap-4">
                {AUTOMATIONS.map((rule) => (
                    <Card key={rule.id} className="hover:border-primary/50 transition-colors">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`h-12 w-12 rounded-full flex items-center justify-center ${rule.active ? "bg-amber-500/10 text-amber-500" : "bg-muted text-muted-foreground"}`}>
                                    <Zap className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{rule.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                        <span>{rule.trigger}</span>
                                        <ArrowRight className="w-3 h-3" />
                                        <span>{rule.action}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className={`px-3 py-1 rounded-full text-xs font-medium border ${rule.active ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-muted text-muted-foreground border-border"}`}>
                                    {rule.active ? "Active" : "Paused"}
                                </div>
                                <Button variant="outline" size="sm">Edit</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
