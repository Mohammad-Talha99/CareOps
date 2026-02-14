"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package, Plus, AlertCircle, Trash2, Edit2, Save, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const MOCK_BUSINESS_ID = "8bb0493a-831a-4a5b-95e0-699f6eb1bab1";

export default function InventoryPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [newItem, setNewItem] = useState({ name: "", quantity: "0", threshold: "5", category: "General" });
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<string | null>(null);
    const [editValues, setEditValues] = useState<any>({});

    const businessId = MOCK_BUSINESS_ID;

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const res = await fetch(`/api/inventory?businessId=${businessId}`);
            if (res.ok) {
                const data = await res.json();
                setItems(data.items);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async () => {
        try {
            const res = await fetch("/api/inventory", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ businessId, ...newItem })
            });
            if (res.ok) {
                fetchInventory();
                setIsDialogOpen(false);
                setNewItem({ name: "", quantity: "0", threshold: "5", category: "General" });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this item?")) return;
        try {
            const res = await fetch(`/api/inventory/${id}`, { method: "DELETE" });
            if (res.ok) fetchInventory();
        } catch (error) {
            console.error(error);
        }
    };

    const startEdit = (item: any) => {
        setEditingItem(item.id);
        setEditValues({ quantity: item.quantity, threshold: item.threshold });
    };

    const cancelEdit = () => {
        setEditingItem(null);
        setEditValues({});
    };

    const saveEdit = async (id: string) => {
        try {
            const res = await fetch(`/api/inventory/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(editValues)
            });
            if (res.ok) {
                fetchInventory();
                setEditingItem(null);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const lowStockCount = items.filter(i => i.quantity <= i.threshold).length;

    if (loading && items.length === 0) return <div className="p-8">Loading inventory...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
                    <p className="text-muted-foreground">Track your resources and supplies.</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" /> Add Item
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add New Item</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Item Name</Label>
                                <Input value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} placeholder="e.g. Syringes" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Quantity</Label>
                                    <Input type="number" value={newItem.quantity} onChange={e => setNewItem({ ...newItem, quantity: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Low Stock Threshold</Label>
                                    <Input type="number" value={newItem.threshold} onChange={e => setNewItem({ ...newItem, threshold: e.target.value })} />
                                </div>
                            </div>
                            <Button onClick={handleAddItem} className="w-full">Save Item</Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Summary Cards */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                        <Package className="w-4 h-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent><div className="text-2xl font-bold">{items.length}</div></CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
                        <AlertCircle className={lowStockCount > 0 ? "w-4 h-4 text-orange-500" : "w-4 h-4 text-muted-foreground"} />
                    </CardHeader>
                    <CardContent><div className={`text-2xl font-bold ${lowStockCount > 0 ? "text-orange-500" : ""}`}>{lowStockCount}</div></CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Inventory List</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {items.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">No items found. Add one to get started.</div>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
                                            <Package className="w-5 h-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{item.name}</h3>
                                            <p className="text-sm text-muted-foreground">Threshold: {item.threshold}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        {editingItem === item.id ? (
                                            <div className="flex items-center gap-2 bg-background p-2 rounded border shadow-sm">
                                                <div className="w-20">
                                                    <Label className="text-xs">Qty</Label>
                                                    <Input
                                                        type="number"
                                                        className="h-8"
                                                        value={editValues.quantity}
                                                        onChange={(e) => setEditValues({ ...editValues, quantity: e.target.value })}
                                                    />
                                                </div>
                                                <div className="w-20">
                                                    <Label className="text-xs">Min</Label>
                                                    <Input
                                                        type="number"
                                                        className="h-8"
                                                        value={editValues.threshold}
                                                        onChange={(e) => setEditValues({ ...editValues, threshold: e.target.value })}
                                                    />
                                                </div>
                                                <div className="flex gap-1 mt-4">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={() => saveEdit(item.id)}><Save className="w-4 h-4" /></Button>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={cancelEdit}><X className="w-4 h-4" /></Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="text-right">
                                                    <div className="font-bold">{item.quantity}</div>
                                                    <div className="text-xs text-muted-foreground">units</div>
                                                </div>
                                                <StatusBadge quantity={item.quantity} threshold={item.threshold} />
                                                <div className="flex gap-1">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 opacity-50 hover:opacity-100" onClick={() => startEdit(item)}>
                                                        <Edit2 className="w-4 h-4" />
                                                    </Button>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 opacity-50 hover:opacity-100 hover:text-red-600" onClick={() => handleDelete(item.id)}>
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

function StatusBadge({ quantity, threshold }: { quantity: number, threshold: number }) {
    let status = "In Stock";
    let color = "bg-green-500/10 text-green-500 border-green-500/20";

    if (quantity === 0) {
        status = "Out of Stock";
        color = "bg-red-500/10 text-red-500 border-red-500/20";
    } else if (quantity <= threshold) {
        status = "Low Stock";
        color = "bg-orange-500/10 text-orange-500 border-orange-500/20";
    }

    return (
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${color} whitespace-nowrap`}>
            {status}
        </span>
    )
}
