import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Calendar, Mail, MessageSquare, CreditCard } from "lucide-react";

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Settings & Integrations</h2>
                <p className="text-muted-foreground">Manage your connected services.</p>
            </div>

            <div className="grid gap-6">
                <IntegrationSection
                    title="Calendar & Scheduling"
                    desc="Sync bookings with your personal calendar."
                    items={[
                        { name: "Google Calendar", icon: Calendar, connected: true },
                        { name: "Outlook Calendar", icon: Calendar, connected: false }
                    ]}
                />

                <IntegrationSection
                    title="Communication"
                    desc="Connect email and SMS providers."
                    items={[
                        { name: "Gmail / SMTP", icon: Mail, connected: true },
                        { name: "Twilio (SMS)", icon: MessageSquare, connected: false },
                        { name: "WhatsApp Business", icon: MessageSquare, connected: false }
                    ]}
                />

                <IntegrationSection
                    title="Payments"
                    desc="Accept payments for bookings."
                    items={[
                        { name: "Stripe", icon: CreditCard, connected: true },
                        { name: "PayPal", icon: CreditCard, connected: false }
                    ]}
                />
            </div>
        </div>
    )
}

function IntegrationSection({ title, desc, items }: any) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>{desc}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item: any) => (
                    <div key={item.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                                <item.icon className="w-5 h-5" />
                            </div>
                            <span className="font-medium">{item.name}</span>
                        </div>
                        <Button variant={item.connected ? "outline" : "default"} size="sm">
                            {item.connected ? "Manage" : "Connect"}
                        </Button>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
