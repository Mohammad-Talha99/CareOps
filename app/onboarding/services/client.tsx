"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Trash2 } from "lucide-react";

function ServicesContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const businessId = searchParams.get("businessId");

    const [isLoading, setIsLoading] = useState(false);
    const [services, setServices] = useState<any[]>([]);
    const [newService, setNewService] = useState({
        name: "",
        duration: "30",
        price: "0",
        description: "",
        location: "Remote"
    });

    useEffect(() => {
        if (businessId) {
            fetchServices();
        }
    }, [businessId]);

    const fetchServices = async () => {
        const res = await fetch(`/api/onboarding/services?businessId=${businessId}`);
        const data = await res.json();
        if (data.services) setServices(data.services);
    };

    const handleAddService = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/onboarding/services", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    businessId,
                    ...newService
                })
            });

            if (res.ok) {
                setNewService({ name: "", duration: "30", price: "0", description: "", location: "Remote" });
                fetchServices();
            } else {
                alert("Failed to add service");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinish = () => {
        if (services.length === 0) {
            alert("Please add at least one service.");
            return;
        }
        router.push(`/onboarding/availability?businessId=${businessId}`);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Define your Services</CardTitle>
                        <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">Step 3 of 3</span>
                    </div>
                    <CardDescription>What services can customers book with you?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* List of added services */}
                    <div className="space-y-4">
                        {services.length > 0 ? (
                            <div className="grid gap-4">
                                {services.map((service) => (
                                    <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg bg-background">
                                        <div>
                                            <div className="font-semibold">{service.name}</div>
                                            <div className="text-sm text-muted-foreground">{service.duration} mins • ${service.price}</div>
                                        </div>
                                        {/* Mock delete for now */}
                                        <Button variant="ghost" size="icon" className="text-destructive">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                                No services added yet. Add your first one below.
                            </div>
                        )}
                    </div>

                    {/* Add new service form */}
                    <div className="border-t pt-6">
                        <h3 className="text-sm font-medium mb-4">Add New Service</h3>
                        <form onSubmit={handleAddService} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Service Name</Label>
                                    <Input
                                        placeholder="e.g. Initial Consultation"
                                        value={newService.name}
                                        onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Duration (mins)</Label>
                                    <Input
                                        type="number"
                                        value={newService.duration}
                                        onChange={(e) => setNewService({ ...newService, duration: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Price ($)</Label>
                                    <Input
                                        type="number"
                                        value={newService.price}
                                        onChange={(e) => setNewService({ ...newService, price: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Input
                                        placeholder="Brief description..."
                                        value={newService.description}
                                        onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Location</Label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                        value={newService.location}
                                        onChange={(e) => setNewService({ ...newService, location: e.target.value })}
                                    >
                                        <option value="Remote">Remote (Zoom/Meet)</option>
                                        <option value="In-Person">In-Person</option>
                                        <option value="Phone">Phone Call</option>
                                    </select>
                                </div>
                            </div>
                            <Button type="submit" variant="secondary" className="w-full" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                Add Service
                            </Button>
                        </form>
                    </div>

                    <div className="flex justify-between pt-4 border-t">
                        {/* Skip for now if needed, or back */}
                        <div />
                        <Button onClick={handleFinish} disabled={services.length === 0}>
                            Next: Set Availability
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}

export default function ServicesPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
            <ServicesContent />
        </Suspense>
    );
}
