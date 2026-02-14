import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { serviceId, inventoryItemId, quantityUsed } = body;

        if (!serviceId || !inventoryItemId || !quantityUsed) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const link = await prisma.serviceResource.create({
            data: {
                serviceId,
                inventoryItemId,
                quantityUsed: parseInt(quantityUsed)
            }
        });

        return NextResponse.json({ success: true, link });

    } catch (error) {
        console.error("Link inventory error:", error);
        return NextResponse.json({ error: "Failed to link inventory" }, { status: 500 });
    }
}
