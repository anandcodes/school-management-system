
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Checking DB content...');
    try {
        const messages = await prisma.message.findMany({
            orderBy: { createdAt: 'desc' }
        });
        console.log('Total Messages:', messages.length);
        console.log('Last 5 Messages:', JSON.stringify(messages.slice(0, 5), null, 2));

        const users = await prisma.user.findMany();
        console.log('Users:', JSON.stringify(users, null, 2));
    } catch (e) {
        console.error("Error reading DB:", e);
    }
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
