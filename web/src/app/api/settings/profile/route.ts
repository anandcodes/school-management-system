import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// import bcrypt from 'bcryptjs'; // Uncomment after installing bcryptjs

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { userId, name, email, bio } = body;

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Update user profile
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name: name || undefined,
                email: email || undefined,
                // bio field might not exist in schema, add if needed
            },
        });

        // Remove password from response
        const { password, ...userWithoutPassword } = updatedUser as any;

        return NextResponse.json({
            success: true,
            message: 'Profile updated successfully',
            user: userWithoutPassword,
        });
    } catch (error: any) {
        console.error('Profile update error:', error);
        return NextResponse.json(
            { error: 'Failed to update profile', details: error.message },
            { status: 500 }
        );
    }
}
