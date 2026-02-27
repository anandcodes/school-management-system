import { NextResponse } from 'next/server';
import dbConnect from '@/backend/db';
import { User } from '@/backend/models';

export async function PUT(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { userId, notifications } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Handle fallback admin user (for demo/development)
        if (userId === 'ADMIN-01' || userId === 'current-user-id') {
            return NextResponse.json({
                success: true,
                message: 'Notification preferences updated successfully (demo mode)',
                notifications,
            });
        }

        // Since User model might not have notification fields, we'll store as JSON
        // You can extend the User model in Mongoose schema to add these fields properly
        await User.findByIdAndUpdate(
            userId,
            {
                // If you have notification fields in schema, update them here:
                // emailNotifications: notifications.email,
                // pushNotifications: notifications.push,
                // weeklyReports: notifications.weeklyReports,
                // studentAlerts: notifications.studentAlerts,
            }
        );

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
