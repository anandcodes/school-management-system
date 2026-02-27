import { NextResponse } from 'next/server';
import dbConnect from '@/backend/db';
import { Notification } from '@/backend/models';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id: notificationId } = await params;

        const updatedNotification = await Notification.findByIdAndUpdate(
            notificationId,
            { read: true },
            { new: true }
        ).lean();

        return NextResponse.json({ ...updatedNotification, id: (updatedNotification as any)._id.toString() });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to mark notification as read' }, { status: 500 });
    }
}
