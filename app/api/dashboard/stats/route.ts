import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const businessId = searchParams.get("businessId");

        if (!businessId) {
            return NextResponse.json({ error: "Business ID required" }, { status: 400 });
        }

        // 1. Bookings Stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        const bookingsToday = await prisma.booking.count({
            where: {
                businessId,
                date: {
                    gte: today,
                    lt: tomorrow
                }
            }
        });

        const bookingsUpcoming = await prisma.booking.count({
            where: {
                businessId,
                date: {
                    gte: tomorrow,
                    lt: nextWeek
                }
            }
        });

        // 2. Leads Stats
        const newLeads = await prisma.lead.count({
            where: {
                businessId,
                status: "NEW"
            }
        });

        // 3. Forms Stats
        // Count BookingForms with status PENDING across all bookings for this business
        const pendingForms = await prisma.bookingForm.count({
            where: {
                status: "PENDING",
                booking: {
                    businessId
                }
            }
        });

        // 4. Inventory Alerts
        const lowStockItems = await prisma.inventoryItem.findMany({
            where: {
                businessId,
                quantity: {
                    lte: prisma.inventoryItem.fields.threshold
                }
            },
            select: { id: true, name: true, quantity: true, threshold: true }
        });

        // 5. Construct Alerts List
        const alerts = [];
        if (bookingsToday > 0) alerts.push({ type: "info", message: `${bookingsToday} bookings today`, link: "/dashboard/bookings" });
        if (newLeads > 0) alerts.push({ type: "warning", message: `${newLeads} new leads waiting`, link: "/dashboard/leads" });
        if (pendingForms > 0) alerts.push({ type: "warning", message: `${pendingForms} forms need review`, link: "/dashboard/forms" });
        lowStockItems.forEach(item => {
            alerts.push({ type: "critical", message: `Low Stock: ${item.name} (${item.quantity})`, link: "/onboarding/inventory" });
        });

        return NextResponse.json({
            bookings: { today: bookingsToday, upcoming: bookingsUpcoming },
            leads: { new: newLeads },
            forms: { pending: pendingForms },
            inventory: { lowStockCount: lowStockItems.length, items: lowStockItems },
            alerts
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
    }
}
