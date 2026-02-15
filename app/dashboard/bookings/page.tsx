"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CheckCircle2, XCircle, Clock, User, FileText } from "lucide-react";

const MOCK_BUSINESS_ID = "8bb0493a-831a-4a5b-95e0-699f6eb1bab1";

export default function BookingsPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [filteredBookings, setFilteredBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("today"); // today, upcoming, all
    const [counts, setCounts] = useState({ today: 0, upcoming: 0, all: 0 });

    const [businessId, setBusinessId] = useState<string | null>(null);

    useEffect(() => {
        const fetchBusiness = async () => {
            try {
                const res = await fetch("/api/business");
                if (res.ok) {
                    const data = await res.json();
                    setBusinessId(data.business.id);
                }
            } catch (e) {
                console.error("Failed to fetch business ID", e);
            }
        };
        fetchBusiness();
    }, []);

    useEffect(() => {
        if (businessId) {
            fetchBookings();
        }
    }, [businessId]);

    useEffect(() => {
        filterBookings();
    }, [filter, bookings]);

    const fetchBookings = async () => {
        if (!businessId) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/bookings?businessId=${businessId}`);
            if (res.ok) {
                const data = await res.json();
                const allBookings = data.bookings;
                setBookings(allBookings);

                // Calculate counts
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                const todayCount = allBookings.filter((b: any) => {
                    const d = new Date(b.date);
                    return d >= today && d < tomorrow;
                }).length;

                const upcomingCount = allBookings.filter((b: any) => new Date(b.date) >= tomorrow).length;

                setCounts({
                    today: todayCount,
                    upcoming: upcomingCount,
                    all: allBookings.length
                });

                // Auto-switch tab if today is empty but upcoming has items
                if (todayCount === 0 && upcomingCount > 0) {
                    setFilter("upcoming");
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const filterBookings = () => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        let filtered = bookings;

        if (filter === "today") {
            filtered = bookings.filter((b: any) => {
                const d = new Date(b.date);
                return d >= today && d < tomorrow;
            });
        } else if (filter === "upcoming") {
            filtered = bookings.filter((b: any) => new Date(b.date) >= tomorrow);
        }

        // Sort by date asc
        filtered.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setFilteredBookings(filtered);
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/bookings/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                // Update local state
                setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
            }
        } catch (e) {
            console.error(e);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "CONFIRMED": return "bg-blue-100 text-blue-800";
            case "COMPLETED": return "bg-green-100 text-green-800";
            case "NO_SHOW": return "bg-red-100 text-red-800";
            case "CANCELLED": return "bg-gray-100 text-gray-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    if (loading && bookings.length === 0) return <div className="p-8">Loading bookings...</div>;

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Schedule</h2>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" onClick={fetchBookings}>Refresh</Button>
                </div>
            </div>

            <Tabs value={filter} className="space-y-4" onValueChange={setFilter}>
                <TabsList>
                    <TabsTrigger value="today">Today ({counts.today})</TabsTrigger>
                    <TabsTrigger value="upcoming">Upcoming ({counts.upcoming})</TabsTrigger>
                    <TabsTrigger value="all">All History ({counts.all})</TabsTrigger>
                </TabsList>

                <TabsContent value={filter} className="space-y-4">
                    {filteredBookings.length === 0 ? (
                        <div className="text-center py-10 text-muted-foreground border-2 border-dashed rounded-lg">
                            No bookings found for this view.
                        </div>
                    ) : (
                        filteredBookings.map((booking) => (
                            <Card key={booking.id}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <div className="space-y-1">
                                        <CardTitle className="text-base font-semibold">
                                            {booking.service?.name || "Service"}
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(booking.date).toLocaleDateString()} at {new Date(booking.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </CardDescription>
                                    </div>
                                    <Badge className={getStatusColor(booking.status)} variant="secondary">
                                        {booking.status.replace("_", " ")}
                                    </Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <User className="w-4 h-4" />
                                                {booking.customerName}
                                            </div>
                                            {booking.bookingForms?.length > 0 && (
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <FileText className="w-4 h-4" />
                                                    {booking.bookingForms.filter((f: any) => f.status === "COMPLETED").length}/{booking.bookingForms.length} Forms
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {booking.status === "CONFIRMED" && (
                                                <>
                                                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => updateStatus(booking.id, "NO_SHOW")}>
                                                        No Show
                                                    </Button>
                                                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => updateStatus(booking.id, "COMPLETED")}>
                                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                                        Complete
                                                    </Button>
                                                </>
                                            )}
                                            {booking.status === "COMPLETED" && (
                                                <span className="text-sm font-medium text-green-600 flex items-center">
                                                    <CheckCircle2 className="w-4 h-4 mr-1" /> Served
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
