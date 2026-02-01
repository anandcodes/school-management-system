
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const email = 'student@school.edu'; // Using .edu to match Mobile App default
    console.log(`Creating/Updating student user: ${email}...`);

    // First, check if ST-001 exists with .com
    const existingCom = await prisma.user.findUnique({ where: { email: 'student@school.com' } });
    if (existingCom) {
        console.log("Found .com user, updating to .edu...");
        await prisma.user.update({
            where: { email: 'student@school.com' },
            data: { email: 'student@school.edu' }
        });
    } else {
        // Upsert directly
        await prisma.user.upsert({
            where: { email },
            update: {
                role: 'STUDENT',
                id: 'ST-001'
            },
            create: {
                id: 'ST-001',
                email,
                name: 'Student User',
                password: 'student', // Plain text matching app
                role: 'STUDENT',
                avatar: 'https://github.com/shadcn.png',
            },
        });
    }

    console.log("Student User Ready (student@school.edu / student).");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
