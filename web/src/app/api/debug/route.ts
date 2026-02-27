import { NextResponse } from 'next/server';
import dbConnect from '@/backend/db';
import { User, Message } from '@/backend/models';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        console.log("Debug: Starting DB Check...");
        await dbConnect();

        // 1. Check User Count
        const userCount = await User.countDocuments();
        console.log("Debug: User count:", userCount);

        // 2. Try to write a dummy log
        const testMessage = await Message.create({
            senderId: 'DEBUG',
            receiverId: 'DEBUG',
            content: 'Debug Connection Test ' + new Date().toISOString()
        });

        // 3. Clean it up
        await Message.findByIdAndDelete(testMessage._id);

        return NextResponse.json({
            status: 'ok',
            databaseUrlRef: process.env.MONGODB_URI ? 'Defined' : 'UNDEFINED',
            config: {
                host: process.env.MONGODB_URI?.split('@')[1]?.split('/')[0] || 'Unknown',
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
            databaseUrlRef: process.env.MONGODB_URI ? 'Defined (Hidden)' : 'UNDEFINED',
        }, { status: 500 });
    }
}
