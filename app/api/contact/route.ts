import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MOCK_BUSINESS_ID = "cm730vn6600010clc8x6k0k2j";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, message, businessId = MOCK_BUSINESS_ID } = body;

        if (!email || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Find or Create Lead
        let lead = await prisma.lead.findFirst({
            where: { email, businessId }
        });

        if (!lead) {
            lead = await prisma.lead.create({
                data: {
                    email,
                    name,
                    businessId,
                    status: "NEW",
                    source: "CONTACT_FORM"
                }
            });
        }

        // 2. Create Incoming Message
        await prisma.message.create({
            data: {
                content: message,
                sender: "CUSTOMER",
                type: "EMAIL",
                read: false,
                businessId,
                leadId: lead.id
            }
        });

        // 3. Auto-Reply Logic
        // In real app, check if automation is paused. Here we assume new leads get auto-reply.
        if (!lead.automationPaused) {
            await prisma.message.create({
                data: {
                    content: "Thanks for reaching out! We've received your message and will get back to you shortly.",
                    sender: "SYSTEM",
                    type: "EMAIL",
                    read: true,
                    businessId,
                    leadId: lead.id
                }
            });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Contact form error:", error);
        return NextResponse.json({ error: "Failed to submit message" }, { status: 500 });
    }
}
