import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { businessId, title, fields, serviceIds } = body;

        if (!businessId || !title) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const form = await prisma.form.create({
            data: {
                businessId,
                title,
                fields: JSON.stringify(fields || []),
                services: serviceIds && serviceIds.length > 0 ? {
                    connect: serviceIds.map((id: string) => ({ id }))
                } : undefined
            }
        });

        return NextResponse.json({ success: true, form });

    } catch (error) {
        console.error("Create form error:", error);
        return NextResponse.json({ error: "Failed to create form" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const businessId = searchParams.get("businessId");

        if (!businessId) {
            return NextResponse.json({ error: "Business ID required" }, { status: 400 });
        }

        const forms = await prisma.form.findMany({
            where: { businessId },
            include: { services: true }
        });

        return NextResponse.json({ forms });
    } catch (error) {
        console.error("Get forms error:", error);
        return NextResponse.json({ error: "Failed to fetch forms" }, { status: 500 });
    }
}
