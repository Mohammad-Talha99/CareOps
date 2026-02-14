"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UserPlus, Users, Trash2 } from "lucide-react";

const PERMISSIONS = [
    { id: "VIEW_INBOX", label: "Access Inbox" },
    { id: "MANAGE_BOOKINGS", label: "Manage Bookings" },
    { id: "VIEW_FORMS", label: "View Submitted Forms" },
    { id: "MANAGE_INVENTORY", label: "Manage Inventory" }
];

export default function StaffPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const businessId = searchParams.get("businessId");

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

    const handleFinish = () => {
        router.push(`/onboarding/activate?businessId=${businessId}`);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Team & Access</CardTitle>
                        <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">Optional Step</span>
                    </div>
                    <CardDescription>Invite staff members and control what they can access.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* List of Users */}
                    <div className="space-y-4">
                        {users.length > 0 ? (
                            <div className="grid gap-4">
                                {users.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg bg-background">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-muted rounded-full">
                                                <Users className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="font-semibold">{user.name} <span className="text-xs text-muted-foreground">({user.role})</span></div>
                                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                                No other staff added yet. You are the Owner.
                            </div>
                        )}
                    </div>

                    {/* Add new staff form */}
                    <div className="border-t pt-6">
                        <h3 className="text-sm font-medium mb-4">Invite New Staff Member</h3>
                        <form onSubmit={handleAddStaff} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
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
                            </div>

                            <div className="space-y-2">
                                <Label className="mb-2 block">Permissions</Label>
                                <div className="grid grid-cols-2 gap-4 border p-4 rounded-md">
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

                            <Button type="submit" variant="secondary" className="w-full" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                                Send Invite
                            </Button>
                        </form>
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
