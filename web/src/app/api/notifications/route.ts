import { NextResponse } from 'next/server';
import dbConnect from '@/backend/db';
import { Notification } from '@/backend/models';

export async function GET() {
    try {
        await dbConnect();
        const notifications = await Notification.find()
            .sort({ createdAt: -1 })
            .lean();

        const formatted = notifications.map((n: any) => ({ ...n, id: n._id.toString() }));
        return NextResponse.json(formatted);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }
}
