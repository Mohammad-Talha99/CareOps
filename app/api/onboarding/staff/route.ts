import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { businessId, email, name, permissions } = body;

        if (!businessId || !email || !name) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const user = await prisma.user.create({
            data: {
                email,
                name,
                businessId,
                role: "STAFF",
                permissions: JSON.stringify(permissions || [])
            }
        });

        return NextResponse.json({ success: true, user });

    } catch (error) {
        console.error("Create staff error:", error);
        return NextResponse.json({ error: "Failed to create staff member" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const businessId = searchParams.get("businessId");

        if (!businessId) {
            return NextResponse.json({ error: "Business ID required" }, { status: 400 });
        }

        const users = await prisma.user.findMany({
            where: { businessId },
        });

        return NextResponse.json({ users });
    } catch (error) {
        console.error("Get staff error:", error);
        return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
    }
}
