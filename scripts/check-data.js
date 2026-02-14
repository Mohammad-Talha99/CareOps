const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const businesses = await prisma.business.findMany();
    console.log("Businesses found:", businesses.length);
    businesses.forEach(b => {
        console.log(`ID: ${b.id} | Name: ${b.name}`);
    });

    const bookings = await prisma.booking.findMany();
    console.log("\nTotal Bookings:", bookings.length);
    bookings.forEach(b => {
        console.log(`Booking ID: ${b.id} | BusinessID: ${b.businessId} | Date: ${b.date}`);
    });
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
