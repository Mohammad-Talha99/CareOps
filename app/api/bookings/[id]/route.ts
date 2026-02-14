import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await req.json();
        const { status } = body;
        const bookingId = (await params).id;

        if (!status) {
            return NextResponse.json({ error: "Missing status" }, { status: 400 });
        }

        const booking = await prisma.booking.update({
            where: { id: bookingId },
            data: { status }
        });

        return NextResponse.json({ success: true, booking });

    } catch (error) {
        console.error("Update booking error:", error);
        return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
    }
}
