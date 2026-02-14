import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { NotificationService } from "@/lib/notifications";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { date, time, serviceId, service: serviceName, price } = body;

        // 1. Resolve Business (Mock/Demo Logic)
        let business = await prisma.business.findFirst();
        if (!business) {
            business = await prisma.business.create({
                data: {
                    name: "Demo Wellness Co.",
                    slug: "demo-wellness",
                }
            });
        }
        const businessId = business.id;

        // 2. Resolve Lead (Mock/Demo Logic - usually this comes from Auth or Form)
        // For demo, we create a random customer if not provided
        const email = `customer${Math.floor(Math.random() * 10000)}@example.com`;
        const name = `Customer ${Math.floor(Math.random() * 10000)}`;

        let lead = await prisma.lead.findFirst({ where: { email, businessId } });
        if (!lead) {
            lead = await prisma.lead.create({
                data: {
                    email,
                    name,
                    businessId,
                    status: "NEW",
                    source: "BOOKING"
                }
            });
        }

        // 3. Resolve Service (with Resources)
        let service = null;
        if (serviceId) {
            service = await prisma.service.findUnique({
                where: { id: serviceId },
                include: { forms: true, serviceResources: { include: { inventoryItem: true } } }
            });
        } else if (serviceName) {
            service = await prisma.service.findFirst({
                where: { name: serviceName, businessId },
                include: { forms: true, serviceResources: { include: { inventoryItem: true } } }
            });
        }

        // 3.5 Deduct Inventory
        if (service?.serviceResources) {
            for (const resource of service.serviceResources) {
                const item = resource.inventoryItem;
                const newQuantity = item.quantity - resource.quantityUsed;

                // Update quantity
                await prisma.inventoryItem.update({
                    where: { id: item.id },
                    data: { quantity: newQuantity }
                });

                // Check Threshold & Alert
                if (newQuantity <= item.threshold) {
                    await NotificationService.sendInventoryAlert(
                        { ...item, quantity: newQuantity },
                        businessId
                    );
                }
            }
        }

        // 4. Create Booking
        const booking = await prisma.booking.create({
            data: {
                date: new Date(date),
                customerName: name,
                customerEmail: email,
                businessId,
                serviceId: service?.id,
                leadId: lead.id,
                status: "CONFIRMED",
                bookingForms: service && service.forms.length > 0 ? {
                    create: service.forms.map((form) => ({
                        formId: form.id,
                        status: "PENDING"
                    }))
                } : undefined
            }
        });

        // 5. Automation: Send Confirmation (Abstracted)
        // Note: serviceName might come from request or found service
        await NotificationService.sendBookingConfirmation({
            ...booking,
            date: booking.date,
            serviceName: service?.name || serviceName
        }, lead);

        return NextResponse.json({ success: true, bookingId: booking.id });

    } catch (error) {
        console.error("Booking error:", error);
        return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const businessId = searchParams.get("businessId");

        if (!businessId) {
            return NextResponse.json({ error: "Business ID required" }, { status: 400 });
        }

        const bookings = await prisma.booking.findMany({
            where: { businessId },
            include: {
                service: true,
                bookingForms: true,
                lead: true
            },
            orderBy: { date: 'asc' }
        });

        return NextResponse.json({ bookings });

    } catch (error) {
        console.error("Fetch bookings error:", error);
        return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
    }
}
