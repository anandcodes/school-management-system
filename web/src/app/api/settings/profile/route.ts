import { NextResponse } from 'next/server';
import dbConnect from '@/backend/db';
import { User } from '@/backend/models';

export async function PUT(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { userId, name, email, bio } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Handle fallback admin user (for demo/development)
        if (userId === 'ADMIN-01' || userId === 'current-user-id') {
            return NextResponse.json({
                success: true,
                message: 'Profile updated successfully (demo mode)',
                user: {
                    id: userId,
                    name: name || 'Administrator',
                    email: email || 'admin@school.com',
                    role: 'admin',
                },
            });
        }

        // Update actual user in database
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                name: name || undefined,
                email: email || undefined,
                // bio field might not exist in schema, add if needed
            },
            { new: true }
        ).lean();

        // Remove password from response
        const { password, ...userWithoutPassword } = updatedUser as any;

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            user: { ...userWithoutPassword, id: (updatedUser as any)._id.toString() },
        });
    } catch (error: any) {
        console.error('Profile update error:', error);
        return NextResponse.json(
            { error: 'Failed to update profile', details: error.message },
            { status: 500 }
        );
    }
}
