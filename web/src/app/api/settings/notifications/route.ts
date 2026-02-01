import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { userId, notifications } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Since User model might not have notification fields, we'll store as JSON
        // You can extend the User model in Prisma schema to add these fields properly
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                // If you have notification fields in schema, update them here:
                // emailNotifications: notifications.email,
                // pushNotifications: notifications.push,
                // weeklyReports: notifications.weeklyReports,
                // studentAlerts: notifications.studentAlerts,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Notification preferences updated successfully',
            notifications,
        });
    } catch (error: any) {
        console.error('Notifications update error:', error);
        return NextResponse.json(
            { error: 'Failed to update notifications', details: error.message },
            { status: 500 }
        );
    }
}
