"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, ClipboardCheck, MessageSquare, Package, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Mock Business ID for MVP (In real app, get from auth/context)
const MOCK_BUSINESS_ID = "8bb0493a-831a-4a5b-95e0-699f6eb1bab1"; // Matches seeded "Demo Wellness" business

export default function DashboardPage() {
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    // Ideally user ID comes from auth context
    const businessId = MOCK_BUSINESS_ID;

    useEffect(() => {
        // Fetch dashboard stats
        const fetchStats = async () => {
            try {
                // In a real app, we might check if businessId exists/is loaded first
                // For MVP, if we don't have businessId, we might fail or mock.
                // Dynamic fetching:
                const res = await fetch(`/api/dashboard/stats?businessId=${businessId}`);
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [businessId]);

    const handleQuickAction = (action: string) => {
        console.log("Quick action:", action);
        // Implement quick action logic
    };

    if (loading) {
        return <div className="p-8">Loading dashboard...</div>;
    }

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-end space-y-2 mb-4">
                <Button onClick={() => router.push("/book")} className="bg-[#1e293b] hover:bg-[#0f172a] text-white">
                    Open Booking Page
                </Button>
            </div>

            {/* Alerts Section */}
            {stats?.alerts && stats.alerts.length > 0 && (
                <div className="space-y-2 mb-6">
                    {stats.alerts.map((alert: any, idx: number) => (
                        <div key={idx} className={`p-4 rounded-lg flex items-center justify-between ${alert.type === 'critical' ? 'bg-red-100 text-red-800 border-red-200 border' :
                            alert.type === 'warning' ? 'bg-amber-100 text-amber-800 border-amber-200 border' :
                                'bg-blue-100 text-blue-800 border-blue-200 border'
                            }`}>
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-5 h-5" />
                                <span className="font-medium">{alert.message}</span>
                            </div>
                            {alert.link && (
                                <Link href={alert.link} className="text-sm font-bold hover:underline flex items-center gap-1">
                                    Take Action <ArrowRight className="w-3 h-3" />
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <Link href="/dashboard/bookings" className="block h-full cursor-pointer hover:bg-muted/50 transition-colors">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Today's Bookings
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats?.bookings?.today || 0}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats?.bookings?.upcoming || 0} upcoming next 7 days
                            </p>
                        </CardContent>
                    </Link>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            New Leads
                        </CardTitle>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.leads?.new || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Waiting for response
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Forms</CardTitle>
                        <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.forms?.pending || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Need review
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Inventory Alerts
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.inventory?.lowStockCount || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            Items low on stock
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        {/* Placeholder for charted data or detailed list */}
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-md">
                            Chart Placeholder: Revenue / Bookings over time
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>
                            Latest actions in your workspace.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {/* Mock recent activity */}
                            <div className="flex items-center">
                                <span className="relative flex h-2 w-2 mr-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                                </span>
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        System Active
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Monitoring business health
                                    </p>
                                </div>
                                <div className="ml-auto font-medium text-green-500">Online</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
