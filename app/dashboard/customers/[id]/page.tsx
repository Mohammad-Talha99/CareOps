"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, Calendar, Clock, Save, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

export default function CustomerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [customer, setCustomer] = useState<any>(null);
    const [notes, setNotes] = useState("");
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchCustomer = async () => {
            const res = await fetch(`/api/customers/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                setCustomer(data.customer);
                setNotes(data.customer.notes || "");
            }
        };
        fetchCustomer();
    }, [params.id]);

    const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        setNotes(newValue);

        // Auto-save logic (debounce)
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        setSaving(true);
        timeoutRef.current = setTimeout(async () => {
            try {
                const res = await fetch(`/api/customers/${params.id}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ notes: newValue })
                });
                if (res.ok) {
                    setLastSaved(new Date());
                }
            } catch (err) {
                console.error("Failed to save notes", err);
            } finally {
                setSaving(false);
            }
        }, 1000); // Save after 1 second of inactivity
    };

    if (!customer) return <div className="p-8">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="ghost" onClick={() => router.back()}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
                {/* Left Sidebar: Profile & History */}
                <div className="md:col-span-1 space-y-6 border-r pr-6 overflow-y-auto">
                    <div className="text-center">
                        <Avatar className="w-24 h-24 mx-auto mb-4">
                            <AvatarFallback className="text-2xl">{customer.name?.[0] || "?"}</AvatarFallback>
                        </Avatar>
                        <h1 className="text-2xl font-bold">{customer.name || "Unknown Lead"}</h1>
                        <p className="text-muted-foreground">{customer.email}</p>
                        <div className="mt-4 flex justify-center gap-2">
                            <Button variant="outline" size="sm"><Mail className="w-4 h-4 mr-2" /> Email</Button>
                            <Button variant="outline" size="sm"><Phone className="w-4 h-4 mr-2" /> Call</Button>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3 uppercase text-xs tracking-wider text-muted-foreground">Recent Bookings</h3>
                        <div className="space-y-3">
                            {customer.bookings?.length > 0 ? customer.bookings.map((b: any) => (
                                <div key={b.id} className="p-3 border rounded-lg bg-card text-sm">
                                    <div className="font-medium">{b.service?.name || "Appointment"}</div>
                                    <div className="text-muted-foreground flex items-center gap-2 mt-1">
                                        <Calendar className="w-3 h-3" />
                                        {new Date(b.date).toLocaleDateString()}
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-muted-foreground italic">No bookings yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Area: Notion-like Notes */}
                <div className="md:col-span-2 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <span className="text-xl">📄</span> Customer Notes
                        </h2>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                            {saving ? (
                                <span className="flex items-center text-blue-500">
                                    <Loader2 className="w-3 h-3 animate-spin mr-1" /> Saving...
                                </span>
                            ) : lastSaved ? (
                                <span className="flex items-center text-green-600">
                                    <ClipboardCheck className="w-3 h-3 mr-1" /> Saved {lastSaved.toLocaleTimeString()}
                                </span>
                            ) : null}
                        </div>
                    </div>

                    <div className="flex-1 bg-background border rounded-lg shadow-sm p-6 relative group">
                        <textarea
                            className="w-full h-full resize-none outline-none bg-transparent text-lg leading-relaxed placeholder:text-muted-foreground/50"
                            placeholder="Type notes here... (e.g. Preferences, key interactions, important details)"
                            value={notes}
                            onChange={handleNotesChange}
                            spellCheck={false}
                        />
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-muted-foreground pointer-events-none">
                            Markdown supported
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ClipboardCheck({ className, ...props }: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
            <path d="m9 14 2 2 4-4" />
        </svg>
    )
}
