const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // 1. Find or Create Business
    let business = await prisma.business.findFirst();
    if (!business) {
        console.log("No business found. Creating one...");
        business = await prisma.business.create({
            data: {
                name: "CareOps Wellness",
                slug: "careops-wellness",
                status: "ACTIVE"
            }
        });
    }

    // 2. Define Services
    const services = [
        {
            name: "General Consultation",
            duration: 30,
            price: 50,
            description: "A comprehensive initial health checkup and assessment.",
            location: "Clinic"
        },
        {
            name: "Specialist Review",
            duration: 45,
            price: 150,
            description: "Detailed review with a senior specialist for complex cases.",
            location: "Clinic"
        },
        {
            name: "Therapy Session",
            duration: 60,
            price: 120,
            description: "One-on-one mental health support session.",
            location: "Remote"
        },
        {
            name: "Follow-up Visit",
            duration: 20,
            price: 40,
            description: "Quick check-in to monitor progress and adjust treatment.",
            location: "Clinic"
        },
        {
            name: "Nutrition Planning",
            duration: 45,
            price: 90,
            description: "Personalized diet and nutrition plan creation.",
            location: "Remote"
        },
        {
            name: "Emergency Consult",
            duration: 15,
            price: 80,
            description: "Urgent care consultation for immediate issues.",
            location: "Clinic"
        }
    ];

    console.log(`Seeding ${services.length} services...`);

    for (const s of services) {
        // Check if exists to avoid duplicates
        const exists = await prisma.service.findFirst({
            where: {
                businessId: business.id,
                name: s.name
            }
        });

        if (!exists) {
            await prisma.service.create({
                data: {
                    businessId: business.id,
                    ...s
                }
            });
            console.log(`Created: ${s.name}`);
        } else {
            console.log(`Skipped (Exists): ${s.name}`);
        }
    }

    console.log("Seeding complete!");
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
