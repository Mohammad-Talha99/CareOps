import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const customer = await prisma.lead.findUnique({
            where: { id },
            include: {
                bookings: {
                    orderBy: { date: 'desc' },
                    take: 5
                },
                message: {
                    orderBy: { createdAt: 'desc' },
                    take: 5
                }
            }
        });

        if (!customer) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        }

        return NextResponse.json({ customer });
    } catch (error) {
        console.error("Get customer error:", error);
        return NextResponse.json({ error: "Failed to fetch customer" }, { status: 500 });
    }
}


export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { notes } = body;

        const customer = await prisma.lead.update({
            where: { id },
            data: { notes }
        });

        return NextResponse.json({ success: true, customer });
    } catch (error) {
        console.error("Update notes error:", error);
        return NextResponse.json({ error: "Failed to update notes" }, { status: 500 });
    }
}
