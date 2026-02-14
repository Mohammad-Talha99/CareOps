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

        const business = await prisma.business.findUnique({
            where: { id: businessId },
            include: {
                _count: {
                    select: { services: true, integrations: true }
                }
            }
        });

        if (!business) {
            return NextResponse.json({ error: "Business not found" }, { status: 404 });
        }

        const checks = {
            hasServices: business._count.services > 0,
            hasIntegrations: business._count.integrations > 0,
            hasAvailability: !!business.availability
        };

        const isReady = checks.hasServices && checks.hasIntegrations && checks.hasAvailability;

        return NextResponse.json({
            ready: isReady,
            checks
        });

    } catch (error) {
        console.error("Validation error:", error);
        return NextResponse.json({ error: "Failed to validate workspace" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { businessId } = body;

        if (!businessId) {
            return NextResponse.json({ error: "Missing business ID" }, { status: 400 });
        }

        await prisma.business.update({
            where: { id: businessId },
            data: { status: "ACTIVE" }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Activation error:", error);
        return NextResponse.json({ error: "Failed to activate workspace" }, { status: 500 });
    }
}
