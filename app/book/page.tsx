"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Clock, Check, Calendar as CalendarIcon, MapPin } from "lucide-react";
import Navbar from "@/components/navbar";
import { format, addMinutes, setHours, setMinutes, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";

export default function PublicBookingPage() {
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [services, setServices] = useState<any[]>([]);
    const [selectedService, setSelectedService] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadServices = async () => {
            try {
                const res = await fetch("/api/onboarding/services");
                if (res.ok) {
                    const data = await res.json();
                    if (data.services) setServices(data.services);
                }
            } catch (error) {
                console.error("Failed to load services", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadServices();
    }, []);

    // Generate time slots based on duration
    const timeSlots: string[] = [];
    if (selectedService && selectedDate) {
        let start = setMinutes(setHours(new Date(selectedDate), 8), 0); // 8:00 AM of selected date
        const end = setMinutes(setHours(new Date(selectedDate), 22), 0); // 10:00 PM of selected date
        const now = new Date();

        while (start < end) {
            // If the slot is in the future relative to now, check if it's today
            // If today, filter out past times
            if (now < start) {
                timeSlots.push(format(start, "h:mm a"));
            }
            start = addMinutes(start, selectedService.duration);
        }
    }

    const handleBooking = async () => {
        if (!selectedDate || !selectedTime || !selectedService) return;

        setIsSubmitting(true);
        try {
            const formattedDate = format(selectedDate, "yyyy-MM-dd");

            const res = await fetch("/api/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    date: formattedDate,
                    time: selectedTime,
                    serviceId: selectedService.id,
                    service: selectedService.name,
                    price: selectedService.price
                })
            });

            if (res.ok) {
                setStep(3);
            } else {
                alert("Failed to book appointment. Please try again.");
            }
        } catch (e) {
            console.error("Booking failed", e);
            alert("An error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-background text-foreground">
            <Navbar />

            <div className="container mx-auto px-4 py-32 max-w-5xl">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold mb-4">Book an Appointment</h1>
                    <p className="text-muted-foreground text-lg">Schedule your visit with our expert team.</p>
                </div>

                <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden min-h-[500px] flex flex-col md:flex-row">
                    {/* Sidebar / Progress (Desktop) */}
                    <div className="bg-muted/30 p-8 md:w-1/3 border-b md:border-b-0 md:border-r flex flex-col gap-6">
                        <div>
                            <h3 className="font-semibold mb-2 text-sm uppercase tracking-wider text-muted-foreground">Your Selection</h3>
                            {selectedService ? (
                                <div className="bg-background p-4 rounded-lg border shadow-sm">
                                    <div className="font-bold text-lg mb-1">{selectedService.name}</div>
                                    <div className="text-sm text-muted-foreground flex items-center gap-2 mb-2">
                                        <Clock className="w-3 h-3" /> {selectedService.duration} mins
                                        <span className="mx-1">•</span>
                                        <MapPin className="w-3 h-3" /> {selectedService.location}
                                    </div>
                                    <div className="font-mono text-primary font-bold">${selectedService.price}</div>
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground italic">No service selected</div>
                            )}
                        </div>

                        {selectedDate && (
                            <div>
                                <h3 className="font-semibold mb-2 text-sm uppercase tracking-wider text-muted-foreground">Date & Time</h3>
                                <div className="bg-background p-4 rounded-lg border shadow-sm flex items-center gap-3">
                                    <CalendarIcon className="w-5 h-5 text-primary" />
                                    <div>
                                        <div className="font-medium">{format(selectedDate, "EEE, MMM do")}</div>
                                        {selectedTime && <div className="text-sm text-muted-foreground">{selectedTime}</div>}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="mt-auto hidden md:block">
                            <div className="flex gap-2">
                                <div className={`h-2 rounded-full flex-1 transition-colors ${step >= 1 ? 'bg-primary' : 'bg-muted'}`} />
                                <div className={`h-2 rounded-full flex-1 transition-colors ${step >= 2 ? 'bg-primary' : 'bg-muted'}`} />
                                <div className={`h-2 rounded-full flex-1 transition-colors ${step >= 3 ? 'bg-primary' : 'bg-muted'}`} />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                                <span>Service</span>
                                <span>Time</span>
                                <span>Confirm</span>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 p-8 bg-card">
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <h2 className="text-2xl font-bold">Select a Service</h2>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {isLoading ? (
                                        <div className="col-span-2 text-center p-12 text-muted-foreground">
                                            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                                            Loading services...
                                        </div>
                                    ) : services.length > 0 ? (
                                        services.map((s) => (
                                            <div
                                                key={s.id}
                                                className={cn(
                                                    "p-4 border rounded-xl cursor-pointer transition-all hover:shadow-md",
                                                    selectedService?.id === s.id ? "border-primary ring-1 ring-primary bg-primary/5" : "hover:border-primary/50"
                                                )}
                                                onClick={() => { setSelectedService(s); setStep(2); }}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-bold text-lg">{s.name}</span>
                                                    <span className="font-mono bg-muted px-2 py-1 rounded text-sm">${s.price}</span>
                                                </div>
                                                {s.description && (
                                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{s.description}</p>
                                                )}
                                                <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {s.duration}m
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" /> {s.location}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-2 text-center p-8 border border-dashed rounded-lg">
                                            No services available.
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold">Select Date & Time</h2>
                                    <Button variant="ghost" size="sm" onClick={() => setStep(1)}>Change Service</Button>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="flex justify-center md:justify-start">
                                        <Calendar
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={setSelectedDate}
                                            className="rounded-md border shadow-sm p-4"
                                            disabled={(date) => date < startOfDay(new Date())} // Disable past dates
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <h3 className="font-medium text-sm">Available Slots {selectedDate ? `for ${format(selectedDate, "MMM do")}` : ""}</h3>
                                        {!selectedDate ? (
                                            <div className="text-center p-8 border border-dashed rounded-lg text-muted-foreground text-sm">
                                                Please select a date first
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-2">
                                                {timeSlots.map(time => (
                                                    <Button
                                                        key={time}
                                                        variant={selectedTime === time ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => setSelectedTime(time)}
                                                        className="w-full"
                                                    >
                                                        {time}
                                                    </Button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 border-t">
                                    <Button
                                        size="lg"
                                        disabled={!selectedDate || !selectedTime || isSubmitting}
                                        onClick={handleBooking}
                                        className="w-full md:w-auto px-8"
                                    >
                                        {isSubmitting ? "Confirming Booking..." : "Confirm Booking"}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-300 py-12">
                                <div className="w-24 h-24 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mb-4">
                                    <Check className="w-12 h-12" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-bold">Booking Confirmed!</h2>
                                    <p className="text-muted-foreground text-lg max-w-md mx-auto">
                                        Your appointment for <span className="font-semibold text-foreground">{selectedService?.name}</span> has been successfully scheduled.
                                    </p>
                                </div>

                                <div className="bg-muted/50 p-6 rounded-xl border w-full max-w-md space-y-3 text-left">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Date</span>
                                        <span className="font-bold">{selectedDate ? format(selectedDate, "PPPP") : ""}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Time</span>
                                        <span className="font-bold">{selectedTime}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2 mt-2">
                                        <span className="text-muted-foreground">Location</span>
                                        <span className="font-bold">{selectedService?.location}</span>
                                    </div>
                                </div>

                                <Button size="lg" variant="outline" onClick={() => { setStep(1); setSelectedDate(undefined); setSelectedTime(null); }} className="mt-8">
                                    Book Another Appointment
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
