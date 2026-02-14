"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, User, Calendar, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const MOCK_BUSINESS_ID = "8bb0493a-831a-4a5b-95e0-699f6eb1bab1";

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const router = useRouter();

    const businessId = MOCK_BUSINESS_ID;

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await fetch(`/api/customers?businessId=${businessId}`);
                if (res.ok) {
                    const data = await res.json();
                    setCustomers(data.customers);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchCustomers();
    }, []);

    const filtered = customers.filter(c =>
    (c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()))
    );

    if (loading) return <div className="p-8">Loading customers...</div>;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Customers</h2>
                    <p className="text-muted-foreground">Manage your client relationships.</p>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name or email..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <div className="grid gap-4">
                {filtered.map((customer) => (
                    <Card
                        key={customer.id}
                        className="hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => router.push(`/dashboard/customers/${customer.id}`)}
                    >
                        <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback>{customer.name?.[0] || customer.email[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold">{customer.name || "Unknown"}</h3>
                                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-8 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    <span>{customer._count?.bookings || 0} bookings</span>
                                </div>
                                <div className={`px-2 py-0.5 rounded-full text-xs border ${customer.status === "NEW" ? "bg-blue-100 text-blue-700 border-blue-200" :
                                        customer.status === "CONTACTED" ? "bg-amber-100 text-amber-700 border-amber-200" :
                                            "bg-green-100 text-green-700 border-green-200"
                                    }`}>
                                    {customer.status}
                                </div>
                                <ArrowRight className="w-4 h-4 opacity-50" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {filtered.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground border border-dashed rounded-lg">
                        No customers found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
}
