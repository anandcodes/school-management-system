import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: notificationId } = await params;
        // Note: My Notification model doesn't strictly have a 'read' column in this version, 
        // but assuming we added it or will add it. If not, this is a placeholder.
        // Checking schema... it HAS 'read Boolean @default(false)'

        const updatedNotification = await prisma.notification.update({
            where: { id: notificationId },
            data: { read: true },
        });
        return NextResponse.json(updatedNotification);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to mark notification as read' }, { status: 500 });
    }
}
