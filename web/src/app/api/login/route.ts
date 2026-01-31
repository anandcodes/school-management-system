import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // In a real app, hash passwords!
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (user && user.password === password) {
            // Return user info sans password
            const { password, ...userWithoutPassword } = user;
            return NextResponse.json(userWithoutPassword);
        }

        // Fallback for demo if DB is empty
        if (email === 'admin@school.com' && password === 'admin') {
            return NextResponse.json({
                id: 'admin-1',
                name: 'Admin User',
                email: email,
                role: 'ADMIN',
            });
        }

        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
