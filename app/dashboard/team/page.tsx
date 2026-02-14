"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UserPlus, Users, Trash2 } from "lucide-react";

// TODO: Replace with dynamic auth
const MOCK_BUSINESS_ID = "8bb0493a-831a-4a5b-95e0-699f6eb1bab1";

const PERMISSIONS = [
    { id: "VIEW_INBOX", label: "Access Inbox" },
    { id: "MANAGE_BOOKINGS", label: "Manage Bookings" },
    { id: "VIEW_FORMS", label: "View Submitted Forms" },
    { id: "MANAGE_INVENTORY", label: "Manage Inventory" }
];

export default function TeamPage() {
    const businessId = MOCK_BUSINESS_ID;

    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState<any[]>([]);

    const [newStaff, setNewStaff] = useState({
        name: "",
        email: "",
        permissions: [] as string[]
    });

    useEffect(() => {
        if (businessId) {
            fetchUsers();
        }
    }, [businessId]);

    const fetchUsers = async () => {
        const res = await fetch(`/api/onboarding/staff?businessId=${businessId}`);
        const data = await res.json();
        if (data.users) setUsers(data.users);
    };

    const handlePermissionChange = (permId: string, checked: boolean) => {
        if (checked) {
            setNewStaff(prev => ({ ...prev, permissions: [...prev.permissions, permId] }));
        } else {
            setNewStaff(prev => ({ ...prev, permissions: prev.permissions.filter(p => p !== permId) }));
        }
    };

    const handleAddStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/onboarding/staff", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    businessId,
                    ...newStaff
                })
            });

            if (res.ok) {
                setNewStaff({ name: "", email: "", permissions: [] });
                fetchUsers();
            } else {
                const err = await res.json();
                alert(err.error || "Failed to add staff");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Team Management</h1>
                <p className="text-muted-foreground">Manage your staff and their access permissions.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Invite Column */}
                <Card>
                    <CardHeader>
                        <CardTitle>Invite New Member</CardTitle>
                        <CardDescription>Send an invitation to a new staff member.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddStaff} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input
                                    placeholder="e.g. Joy Nurse"
                                    value={newStaff.name}
                                    onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Email Address</Label>
                                <Input
                                    type="email"
                                    placeholder="nurse@company.com"
                                    value={newStaff.email}
                                    onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="mb-2 block">Permissions</Label>
                                <div className="grid grid-cols-1 gap-2 border p-4 rounded-md">
                                    {PERMISSIONS.map((perm) => (
                                        <div key={perm.id} className="flex items-center space-x-2">
                                            <Checkbox
                                                id={perm.id}
                                                checked={newStaff.permissions.includes(perm.id)}
                                                onCheckedChange={(checked) => handlePermissionChange(perm.id, checked as boolean)}
                                            />
                                            <label
                                                htmlFor={perm.id}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {perm.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                                Send Invite
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* List Column */}
                <Card>
                    <CardHeader>
                        <CardTitle>Team Members</CardTitle>
                        <CardDescription>People with access to this workspace.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {users.length > 0 ? (
                                <div className="grid gap-3">
                                    {users.map((user) => (
                                        <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/20">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                                                    <Users className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-sm">{user.name}</div>
                                                    <div className="text-xs text-muted-foreground">{user.email}</div>
                                                </div>
                                            </div>
                                            <div className="text-xs font-mono bg-muted px-2 py-1 rounded capitalize">
                                                {user.role.toLowerCase()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                                    Loading team...
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
