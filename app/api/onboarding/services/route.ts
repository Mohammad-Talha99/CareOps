import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { businessId, name, duration, price, description, location } = body;

        if (!businessId || !name || !duration || !price) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const service = await prisma.service.create({
            data: {
                businessId,
                name,
                duration: parseInt(duration),
                price: parseFloat(price),
                description,
                location: location || "Remote"
            }
        });

        return NextResponse.json({ success: true, service });

    } catch (error) {
        console.error("Create service error:", error);
        return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const businessId = searchParams.get("businessId");
        const slug = searchParams.get("slug");

        let whereClause = {};
        if (businessId) whereClause = { businessId };
        else if (slug) {
            const business = await prisma.business.findUnique({ where: { slug } });
            if (!business) return NextResponse.json({ error: "Business not found" }, { status: 404 });
            whereClause = { businessId: business.id };
        } else {
            // Fallback for demo: find first business
            const business = await prisma.business.findFirst();
            if (business) whereClause = { businessId: business.id };
        }

        const services = await prisma.service.findMany({
            where: whereClause
        });

        return NextResponse.json({ services });
    } catch (error) {
        console.error("Get services error:", error);
        return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
    }
}
