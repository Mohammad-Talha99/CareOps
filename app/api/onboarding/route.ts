import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { businessName, address, timeZone, supportEmail, ownerName, ownerEmail } = body;

        // Basic validation
        if (!businessName || !ownerEmail) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const slug = businessName.toLowerCase().replace(/[^a-z0-1]+/g, "-");

        // Check if slug exists
        const existing = await prisma.business.findUnique({ where: { slug } });
        if (existing) {
            return NextResponse.json({ error: "Business name already taken" }, { status: 400 });
        }

        // Transaction to create Business and Owner User
        const result = await prisma.$transaction(async (tx) => {
            const business = await tx.business.create({
                data: {
                    name: businessName,
                    slug,
                    address,
                    timeZone,
                    supportEmail,
                }
            });

            // Check if user exists, if not create, if yes update
            let user = await tx.user.findUnique({ where: { email: ownerEmail } });

            if (!user) {
                user = await tx.user.create({
                    data: {
                        email: ownerEmail,
                        name: ownerName,
                        role: "OWNER",
                        businessId: business.id
                    }
                });
            } else {
                // If user exists, link them to the new business (mocking multi-tenant or overwrite for demo)
                user = await tx.user.update({
                    where: { email: ownerEmail },
                    data: {
                        businessId: business.id,
                        role: "OWNER"
                    }
                });
            }

            return { business, user };
        });

        return NextResponse.json({ success: true, businessId: result.business.id, slug: result.business.slug });

    } catch (error) {
        console.error("Onboarding error:", error);
        return NextResponse.json({ error: "Failed to create workspace" }, { status: 500 });
    }
}
