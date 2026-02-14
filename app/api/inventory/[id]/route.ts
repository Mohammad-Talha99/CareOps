import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = 'force-dynamic';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { quantity, threshold, name } = body;

        const updateData: any = {};
        if (quantity !== undefined) updateData.quantity = parseInt(quantity);
        if (threshold !== undefined) updateData.threshold = parseInt(threshold);
        if (name !== undefined) updateData.name = name;

        const item = await prisma.inventoryItem.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json({ success: true, item });
    } catch (error) {
        console.error("Update inventory error:", error);
        return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.inventoryItem.delete({
            where: { id }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete inventory error:", error);
        return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
    }
}
