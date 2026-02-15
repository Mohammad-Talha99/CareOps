const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const businesses = await prisma.business.findMany();
    console.log("Businesses found:", businesses);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
