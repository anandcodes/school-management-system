import { NextResponse } from 'next/server';
import dbConnect from '@/backend/db';
import { User } from '@/backend/models';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();
        // Test MongoDB connection via Mongoose
        const userCount = await User.countDocuments();
        return NextResponse.json({
            status: 'success',
            driver: 'mongodb (via mongoose)',
            userCount,
        });
    } catch (e: any) {
        return NextResponse.json({
            status: 'error',
            message: e.message,
            driver: 'mongodb (via mongoose)',
        }, { status: 500 });
    }
}
