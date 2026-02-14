import {
    Calendar,
    MessageSquare,
    Package,
    Users,
    Zap,
    ShieldCheck,
    Clock,
    BarChart
} from "lucide-react";

export default function FeaturesPage() {
    const features = [
        {
            icon: Calendar,
            title: "Smart Booking System",
            description: "Automated scheduling that respects your business hours. Handle recurring appointments, buffer times, and service-specific durations seamlessly."
        },
        {
            icon: MessageSquare,
            title: "Unified Inbox",
            description: "Consolidate all your customer communications. SMS, Email, and social DMs in one place. Never miss a lead again."
        },
        {
            icon: Package,
            title: "Inventory Management",
            description: "Real-time stock tracking with low-stock alerts. Automatically deduct materials used during services."
        },
        {
            icon: Users,
            title: "Customer CRM",
            description: "Detailed client profiles with history, preferences, and rich Notion-style notes. Know your customers better."
        },
        {
            icon: Zap,
            title: "Automation Rules",
            description: "Set it and forget it. Auto-confirm bookings, send reminders, and follow up with leads without lifting a finger."
        },
        {
            icon: BarChart,
            title: "Business Analytics",
            description: "Visualize your growth. Track revenue, booking rates, and inventory costs with beautiful, easy-to-read dashboards."
        },
        {
            icon: ShieldCheck,
            title: "Role-Based Access",
            description: "Secure your data. Give staff access only to what they need, while keeping sensitive business settings private."
        },
        {
            icon: Clock,
            title: "Staff Scheduling",
            description: "Manage team shifts and availability. Ensure the right people are booked for the right jobs."
        }
    ];

    return (
        <div className="min-h-screen bg-background text-foreground pt-24 pb-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="text-center mb-16 space-y-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
                        Everything you need to run your <span className="text-primary">Service Business</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Stop juggling multiple apps. CareOps brings bookings, payments, team management, and customer data into one unified operating system.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="p-8 rounded-2xl border bg-card hover:shadow-lg transition-shadow duration-300 group">
                            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                                <feature.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center bg-muted/30 rounded-3xl p-12 border border-border/50">
                    <h2 className="text-3xl font-bold mb-4">Ready to streamline your operations?</h2>
                    <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                        Join thousands of service businesses growing faster with CareOps.
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center justify-center h-12 px-8 font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Get Started Today
                    </a>
                </div>
            </div>
        </div>
    );
}
