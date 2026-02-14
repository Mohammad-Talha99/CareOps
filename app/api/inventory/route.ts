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

        const items = await prisma.inventoryItem.findMany({
            where: { businessId },
            orderBy: { name: 'asc' }
        });

        return NextResponse.json({ items });
    } catch (error) {
        console.error("Get inventory error:", error);
        return NextResponse.json({ error: "Failed to fetch inventory" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { businessId, name, quantity, threshold, category } = body;

        if (!businessId || !name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const item = await prisma.inventoryItem.create({
            data: {
                businessId,
                name,
                quantity: parseInt(quantity || "0"),
                threshold: parseInt(threshold || "5"),
                // Add category if schema supports it, otherwise ignore or migrate schema
                // For now, assuming basic schema
            }
        });

        return NextResponse.json({ success: true, item });

    } catch (error) {
        console.error("Create inventory error:", error);
        return NextResponse.json({ error: "Failed to create inventory item" }, { status: 500 });
    }
}
