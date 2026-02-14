import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { businessId, availability } = body;

        if (!businessId || !availability) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Save availability as JSON string on the Business model
        await prisma.business.update({
            where: { id: businessId },
            data: {
                availability: JSON.stringify(availability)
            }
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Save availability error:", error);
        return NextResponse.json({ error: "Failed to save availability" }, { status: 500 });
    }
}
