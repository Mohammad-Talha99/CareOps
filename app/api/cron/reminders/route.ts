import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { NotificationService } from "@/lib/notifications";

const prisma = new PrismaClient();

// This endpoint would be called by a cron job (e.g. Vercel Cron) daily or hourly.
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const force = searchParams.get("force"); // For testing manually

        // 1. Get bookings for tomorrow (approx 24h from now)
        const now = new Date();
        const tomorrowStart = new Date(now);
        tomorrowStart.setDate(tomorrowStart.getDate() + 1);
        tomorrowStart.setHours(0, 0, 0, 0);

        const tomorrowEnd = new Date(tomorrowStart);
        tomorrowEnd.setHours(23, 59, 59, 999);

        const upcomingBookings = await prisma.booking.findMany({
            where: {
                date: {
                    gte: tomorrowStart,
                    lte: tomorrowEnd
                },
                status: "CONFIRMED",
            },
            include: { lead: true, service: true }
        });

        // Type assertion or check
        // The query included lead and service, so they should be present.
        const bookingsWithRelations = upcomingBookings as any[];

        const results = [];

        for (const booking of bookingsWithRelations) {
            if (!booking.lead || booking.lead.automationPaused) continue;

            try {
                // Send Reminder via Service
                await NotificationService.sendReminder(booking);
                results.push({ bookingId: booking.id, status: "sent" });
            } catch (err) {
                console.error(`Failed to remind booking ${booking.id}`, err);
                results.push({ bookingId: booking.id, status: "failed" });
            }
        }

        // 2. Form Reminders (Simple logic: if booked and form pending)
        // Omitted for brevity in this step, but follows specific pattern.

        return NextResponse.json({ success: true, processed: results.length, details: results });

    } catch (error) {
        console.error("Cron error:", error);
        return NextResponse.json({ error: "Failed to run cron" }, { status: 500 });
    }
}
