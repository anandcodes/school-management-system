
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log("Debug: Starting DB Check...");

        // 1. Check User Count
        const userCount = await prisma.user.count();
        console.log("Debug: User count:", userCount);

        // 2. Try to write a dummy log
        // We reused 'Message' or 'Notification' for a write test implies side effects, 
        // but 'user.count' is a good read test. 
        // Let's create a dummy message to test WRITE permission
        const testMessage = await prisma.message.create({
            data: {
                senderId: 'DEBUG',
                receiverId: 'DEBUG',
                content: 'Debug Connection Test ' + new Date().toISOString()
            }
        });

        // 3. Clean it up
        await prisma.message.delete({ where: { id: testMessage.id } });

        return NextResponse.json({
            status: 'ok',
            databaseUrlRef: process.env.DATABASE_URL ? 'Defined' : 'UNDEFINED',
            config: {
                host: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'Unknown',
            },
            userCount,
            writeTest: 'Success',
            env: process.env.NODE_ENV
        });

    } catch (error: any) {
        console.error("Debug: DB Error:", error);
        return NextResponse.json({
            status: 'error',
            message: error.message,
            stack: error.stack,
            type: error.constructor.name,
            databaseUrlRef: process.env.DATABASE_URL ? 'Defined (Hidden)' : 'UNDEFINED',
        }, { status: 500 });
    }
}
