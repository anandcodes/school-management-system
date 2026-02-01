import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword, comparePassword, validatePassword } from '@/lib/password';

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { userId, currentPassword, newPassword } = body;

        if (!userId || !currentPassword || !newPassword) {
            return NextResponse.json(
                { error: 'User ID, current password, and new password are required' },
                { status: 400 }
            );
        }

        // Validate new password
        const validation = validatePassword(newPassword);
        if (!validation.valid) {
            return NextResponse.json({ error: validation.message }, { status: 400 });
        }

        // Get user with password
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Verify current password
        const isPasswordValid = await comparePassword(currentPassword, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);

        // Update password
        await prisma.user.update({
            where: { id: userId },
            data: {
                password: hashedPassword,
            },
        });

        return NextResponse.json({
            success: true,
            message: 'Password updated successfully',
        });
    } catch (error: any) {
        console.error('Password update error:', error);
        return NextResponse.json(
            { error: 'Failed to update password', details: error.message },
            { status: 500 }
        );
    }
}
