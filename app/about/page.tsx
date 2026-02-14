import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Coffee, Globe, Heart } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background text-foreground pt-24 pb-12">
            {/* Hero Section */}
            <div className="container mx-auto px-4 max-w-4xl text-center mb-24">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-8">
                    Empowering the businesses that <span className="text-primary">care for us.</span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                    CareOps was born from a simple observation: service business owners spend too much time fighting with software and not enough time doing what they love—serving their customers.
                </p>
            </div>

            {/* Stats / Mission */}
            <div className="bg-muted/30 py-20 mb-24 border-y border-border/50">
                <div className="container mx-auto px-4 max-w-6xl grid md:grid-cols-3 gap-12 text-center">
                    <div className="space-y-4">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <Heart className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold">People First</h3>
                        <p className="text-muted-foreground">We build tools that humanize technology, making it work for you, not against you.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold">Speed Matters</h3>
                        <p className="text-muted-foreground">Every second saved on admin is a second earned for your business growth.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                            <Globe className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-bold">Global Vision</h3>
                        <p className="text-muted-foreground">From local barbershops to international consultancies, we scale with you.</p>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="container mx-auto px-4 max-w-6xl mb-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold">Meet the Builders</h2>
                    <p className="text-muted-foreground mt-4">A small team with a big mission.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { name: "Talha", role: "Founder & Lead Engineer", img: "/placeholder-user.jpg" },
                        { name: "Alex Agent", role: "Product Design", img: "/placeholder-user-2.jpg" },
                        { name: "Sarah Logic", role: "Operations", img: "/placeholder-user-3.jpg" },
                    ].map((member, i) => (
                        <div key={i} className="text-center group">
                            <div className="relative mb-6 mx-auto w-48 h-48 rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-primary transition-colors">
                                <Avatar className="w-full h-full rounded-none">
                                    <AvatarFallback className="text-4xl bg-muted text-muted-foreground">
                                        {member.name[0]}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <h3 className="text-xl font-bold">{member.name}</h3>
                            <p className="text-primary font-medium">{member.role}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact CTA */}
            <div className="container mx-auto px-4 max-w-2xl text-center">
                <h2 className="text-3xl font-bold mb-6">Want to get in touch?</h2>
                <p className="text-muted-foreground mb-8">
                    We'd love to hear from you. Whether you have a question about features, pricing, or just want to say hi.
                </p>
                <a
                    href="/contact"
                    className="inline-flex items-center justify-center h-12 px-8 font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
                >
                    Contact Us
                </a>
            </div>
        </div>
    );
}

import { Zap } from "lucide-react";
