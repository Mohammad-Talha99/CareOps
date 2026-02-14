"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Package } from "lucide-react";

function InventoryContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const businessId = searchParams.get("businessId");

    const [isLoading, setIsLoading] = useState(false);
    const [items, setItems] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);

    const [newItem, setNewItem] = useState({
        name: "",
        quantity: "10",
        threshold: "5"
    });

    const [newLink, setNewLink] = useState({
        serviceId: "",
        inventoryItemId: "",
        quantityUsed: "1"
    });

    useEffect(() => {
        if (businessId) {
            fetchItems();
            fetchServices();
        }
    }, [businessId]);

    const fetchItems = async () => {
        const res = await fetch(`/api/onboarding/inventory?businessId=${businessId}`);
        const data = await res.json();
        if (data.items) setItems(data.items);
    };

    const fetchServices = async () => {
        const res = await fetch(`/api/onboarding/services?businessId=${businessId}`);
        const data = await res.json();
        if (data.services) setServices(data.services);
    };

    const handleLinkItem = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/onboarding/inventory/link", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newLink)
            });
            if (res.ok) {
                setNewLink({ serviceId: "", inventoryItemId: "", quantityUsed: "1" });
                alert("Resource linked to service!");
            } else {
                alert("Failed to link resource");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/onboarding/inventory", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    businessId,
                    ...newItem
                })
            });

            if (res.ok) {
                setNewItem({ name: "", quantity: "10", threshold: "5" });
                fetchItems();
            } else {
                alert("Failed to add item");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinish = () => {
        router.push(`/onboarding/staff?businessId=${businessId}`);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Inventory & Resources</CardTitle>
                        <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">Optional Step</span>
                    </div>
                    <CardDescription>Track items used in your services (e.g., Medical Supplies, Products).</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* List of added items */}
                    <div className="space-y-4">
                        {items.length > 0 ? (
                            <div className="grid gap-4">
                                {items.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-background">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-muted rounded-full">
                                                <Package className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="font-semibold">{item.name}</div>
                                                <div className="text-sm text-muted-foreground">In Stock: {item.quantity} | Alert at: {item.threshold}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                                No inventory items added yet.
                            </div>
                        )}
                    </div>

                    {/* Add new item */}
                    <div className="border-t pt-6">
                        <h3 className="text-sm font-medium mb-4">Add Inventory Item</h3>
                        <form onSubmit={handleAddItem} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2 col-span-2">
                                    <Label>Item Name</Label>
                                    <Input
                                        placeholder="e.g. Syringes, Massage Oil"
                                        value={newItem.name}
                                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Initial Quantity</Label>
                                    <Input
                                        type="number"
                                        value={newItem.quantity}
                                        onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Low Stock Threshold (Alert)</Label>
                                    <Input
                                        type="number"
                                        value={newItem.threshold}
                                        onChange={(e) => setNewItem({ ...newItem, threshold: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <Button type="submit" variant="secondary" className="w-full" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                Add Item
                            </Button>
                        </form>
                    </div>

                    {/* Link to Services Section */}
                    <div className="border-t pt-6">
                        <h3 className="text-sm font-medium mb-4">Link Resources to Services (Usage Tracking)</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-3 gap-2">
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    onChange={(e) => setNewLink({ ...newLink, serviceId: e.target.value })}
                                    value={newLink.serviceId}
                                >
                                    <option value="">Select Service</option>
                                    {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>

                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    onChange={(e) => setNewLink({ ...newLink, inventoryItemId: e.target.value })}
                                    value={newLink.inventoryItemId}
                                >
                                    <option value="">Select Item</option>
                                    {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                                </select>

                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Qty Used"
                                        className="w-24"
                                        value={newLink.quantityUsed}
                                        onChange={(e) => setNewLink({ ...newLink, quantityUsed: e.target.value })}
                                    />
                                    <Button size="sm" onClick={handleLinkItem} disabled={isLoading || !newLink.serviceId || !newLink.inventoryItemId}>
                                        Link
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between pt-4 border-t">
                        <div />
                        <Button onClick={handleFinish}>
                            Finish Onboarding
                        </Button>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}

export default function InventoryPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
            <InventoryContent />
        </Suspense>
    );
}
