import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const notificationId = params.id;
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
