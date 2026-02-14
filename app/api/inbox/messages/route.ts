import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const businessId = searchParams.get("businessId");
        const filter = searchParams.get("filter"); // "all", "unread", "leads", "bookings"

        if (!businessId) {
            return NextResponse.json({ error: "Business ID required" }, { status: 400 });
        }

        // Fetch leads with messages
        const leads = await prisma.lead.findMany({
            where: {
                businessId,
                // If filtering by unread, check if any message is unread
            },
            include: {
                message: {
                    orderBy: { createdAt: 'asc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Fetch bookings with messages (if we link messages to bookings)
        // For MVP, we primarily use Lead as the "conversation starter"

        // Transform to unified Conversation object
        const conversations = leads.map(lead => ({
            id: lead.id,
            type: "LEAD",
            name: lead.name || "Unknown Lead",
            email: lead.email,
            status: lead.status,
            messages: lead.message,
            lastMessage: lead.message[lead.message.length - 1],
            unreadCount: lead.message.filter(m => !m.read && m.sender === 'CUSTOMER').length
        }));

        // Sort by last message date
        conversations.sort((a, b) => {
            const dateA = a.lastMessage?.createdAt ? new Date(a.lastMessage.createdAt).getTime() : 0;
            const dateB = b.lastMessage?.createdAt ? new Date(b.lastMessage.createdAt).getTime() : 0;
            return dateB - dateA;
        });

        return NextResponse.json({ conversations });

    } catch (error) {
        console.error("Inbox fetch error:", error);
        return NextResponse.json({ error: "Failed to fetch inbox" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { businessId, leadId, content, sender } = body;

        if (!businessId || !leadId || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const message = await prisma.message.create({
            data: {
                businessId,
                leadId,
                content,
                sender: sender || "USER", // USER = Business Owner, SYSTEM = Auto
                type: "EMAIL", // Default to email for now
                read: true // Outgoing messages are read
            }
        });

        // Update Lead status and pause automation if sender is USER
        await prisma.lead.update({
            where: { id: leadId },
            data: {
                status: "CONTACTED",
                automationPaused: sender === "USER" ? true : undefined
            }
        });

        return NextResponse.json({ success: true, message });

    } catch (error) {
        console.error("Inbox send error:", error);
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
}
