"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, FileText, Link as LinkIcon } from "lucide-react";

export default function FormsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const businessId = searchParams.get("businessId");

    const [isLoading, setIsLoading] = useState(false);
    const [forms, setForms] = useState<any[]>([]);
    const [services, setServices] = useState<any[]>([]);

    const [newForm, setNewForm] = useState({
        title: "",
        serviceIds: [] as string[] // Selected services to link
    });

    useEffect(() => {
        if (businessId) {
            fetchForms();
            fetchServices();
        }
    }, [businessId]);

    const fetchForms = async () => {
        const res = await fetch(`/api/onboarding/forms?businessId=${businessId}`);
        const data = await res.json();
        if (data.forms) setForms(data.forms);
    };

    const fetchServices = async () => {
        const res = await fetch(`/api/onboarding/services?businessId=${businessId}`);
        const data = await res.json();
        if (data.services) setServices(data.services);
    };

    const handleServiceToggle = (serviceId: string) => {
        setNewForm(prev => {
            const exists = prev.serviceIds.includes(serviceId);
            if (exists) {
                return { ...prev, serviceIds: prev.serviceIds.filter(id => id !== serviceId) };
            } else {
                return { ...prev, serviceIds: [...prev.serviceIds, serviceId] };
            }
        });
    };

    const handleAddForm = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/onboarding/forms", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    businessId,
                    title: newForm.title,
                    fields: [{ label: "Notes", type: "textarea" }], // Logic for fields creation is simplified for MVP
                    serviceIds: newForm.serviceIds
                })
            });

            if (res.ok) {
                setNewForm({ title: "", serviceIds: [] });
                fetchForms();
            } else {
                alert("Failed to create form");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFinish = () => {
        router.push(`/onboarding/inventory?businessId=${businessId}`);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Post-Booking Forms</CardTitle>
                        <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">Optional Step</span>
                    </div>
                    <CardDescription>Create forms that are automatically sent when specific services are booked.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    {/* List of added forms */}
                    <div className="space-y-4">
                        {forms.length > 0 ? (
                            <div className="grid gap-4">
                                {forms.map((form) => (
                                    <div key={form.id} className="p-4 border rounded-lg bg-background">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-muted rounded-full">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <div className="font-semibold">{form.title}</div>
                                        </div>

                                        {/* Linked Services Chips */}
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {form.services && form.services.map((s: any) => (
                                                <div key={s.id} className="flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                                    <LinkIcon className="w-3 h-3" />
                                                    {s.name}
                                                </div>
                                            ))}
                                            {(!form.services || form.services.length === 0) && (
                                                <span className="text-xs text-muted-foreground italic">No linked services</span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                                No forms created yet.
                            </div>
                        )}
                    </div>

                    {/* Add new form */}
                    <div className="border-t pt-6">
                        <h3 className="text-sm font-medium mb-4">Create New Form</h3>
                        <form onSubmit={handleAddForm} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Form Title</Label>
                                <Input
                                    placeholder="e.g. Patient Intake, Liability Waiver"
                                    value={newForm.title}
                                    onChange={(e) => setNewForm({ ...newForm, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Link to Services (Triggers this form)</Label>
                                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-2 bg-background">
                                    {services.length > 0 ? services.map(service => (
                                        <label key={service.id} className="flex items-center space-x-2 text-sm cursor-pointer p-1 hover:bg-muted rounded">
                                            <input
                                                type="checkbox"
                                                checked={newForm.serviceIds.includes(service.id)}
                                                onChange={() => handleServiceToggle(service.id)}
                                                className="rounded border-gray-300"
                                            />
                                            <span>{service.name}</span>
                                        </label>
                                    )) : (
                                        <div className="text-xs text-muted-foreground p-2">No services found. Add services first.</div>
                                    )}
                                </div>
                            </div>

                            <Button type="submit" variant="secondary" className="w-full" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
                                Create Form
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
