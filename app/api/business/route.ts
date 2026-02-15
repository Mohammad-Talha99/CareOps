import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        // For MVP, return the first business found
        const business = await prisma.business.findFirst();

        if (!business) {
            return NextResponse.json({ error: "No business found" }, { status: 404 });
        }

        return NextResponse.json({ business });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch business" }, { status: 500 });
    }
}
