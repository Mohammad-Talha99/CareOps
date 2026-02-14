"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function AvailabilityPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const businessId = searchParams.get("businessId");

    const [isLoading, setIsLoading] = useState(false);

    // Initial state: Mon-Fri 9-5, Sat-Sun closed
    const [schedule, setSchedule] = useState(
        DAYS.map(day => ({
            day,
            enabled: ["Saturday", "Sunday"].includes(day) ? false : true,
            start: "09:00",
            end: "17:00"
        }))
    );

    const toggleDay = (index: number) => {
        const newSchedule = [...schedule];
        newSchedule[index].enabled = !newSchedule[index].enabled;
        setSchedule(newSchedule);
    };

    const updateTime = (index: number, field: "start" | "end", value: string) => {
        const newSchedule = [...schedule];
        newSchedule[index] = { ...newSchedule[index], [field]: value };
        setSchedule(newSchedule);
    };

    const handleFinish = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/onboarding/availability", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    businessId,
                    availability: schedule
                })
            });

            if (res.ok) {
                router.push(`/onboarding/forms?businessId=${businessId}`);
            } else {
                alert("Failed to save availability");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/50 p-4">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Set Availability</CardTitle>
                        <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">Last Step</span>
                    </div>
                    <CardDescription>When are you available for bookings?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">

                    <div className="space-y-4">
                        {schedule.map((slot, index) => (
                            <div key={slot.day} className="flex items-center justify-between p-3 border rounded-lg bg-background">
                                <div className="flex items-center gap-4 w-40">
                                    <Switch
                                        checked={slot.enabled}
                                        onCheckedChange={() => toggleDay(index)}
                                    />
                                    <Label className={!slot.enabled ? "text-muted-foreground" : ""}>{slot.day}</Label>
                                </div>

                                {slot.enabled ? (
                                    <div className="flex items-center gap-2">
                                        <Input
                                            type="time"
                                            className="w-32"
                                            value={slot.start}
                                            onChange={(e) => updateTime(index, "start", e.target.value)}
                                        />
                                        <span className="text-muted-foreground">-</span>
                                        <Input
                                            type="time"
                                            className="w-32"
                                            value={slot.end}
                                            onChange={(e) => updateTime(index, "end", e.target.value)}
                                        />
                                    </div>
                                ) : (
                                    <div className="text-sm text-muted-foreground italic w-[270px] text-center">
                                        Unavailable
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <Button onClick={handleFinish} className="w-full" disabled={isLoading}>
                        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Complete Setup
                    </Button>

                </CardContent>
            </Card>
        </div>
    );
}
