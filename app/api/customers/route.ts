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

        const customers = await prisma.lead.findMany({
            where: { businessId },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { bookings: true }
                }
            }
        });

        return NextResponse.json({ customers });
    } catch (error) {
        console.error("Get customers error:", error);
        return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
    }
}
