import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { businessId, emailEnabled, emailKey, smsEnabled, smsKey } = body;

        if (!businessId) {
            return NextResponse.json({ error: "Business ID required" }, { status: 400 });
        }

        if (!emailEnabled && !smsEnabled) {
            return NextResponse.json({ error: "At least one channel must be enabled" }, { status: 400 });
        }

        // Mock "Testing Connection" logic
        const integrations = [];

        if (emailEnabled) {
            // Create Email Integration
            integrations.push(
                prisma.integration.create({
                    data: {
                        type: "EMAIL",
                        provider: "MOCK_SENDGRID", // Placeholder
                        apiKey: emailKey || "mock_key",
                        status: "ACTIVE",
                        businessId
                    }
                })
            );
        }

        if (smsEnabled) {
            // Create SMS Integration
            integrations.push(
                prisma.integration.create({
                    data: {
                        type: "SMS",
                        provider: "MOCK_TWILIO", // Placeholder
                        apiKey: smsKey || "mock_key",
                        status: "ACTIVE",
                        businessId
                    }
                })
            );
        }

        await prisma.$transaction(integrations);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Channel setup error:", error);
        return NextResponse.json({ error: "Failed to setup channels" }, { status: 500 });
    }
}
