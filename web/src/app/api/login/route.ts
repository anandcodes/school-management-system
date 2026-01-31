import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        // In a real app, hash passwords!
        let user = null;

        try {
            user = await prisma.user.findUnique({
                where: { email },
            });
        } catch (dbError) {
            console.error("DB Login Error (ignoring for fallback):", dbError);
        }



        if (user && user.password === password) {
            // Return user info sans password
            const { password: _, ...userWithoutPassword } = user;
            return NextResponse.json(userWithoutPassword);
        }


        // Fallback for demo if DB is empty or fails
        console.log("Checking fallback for:", email, password);
        if (email === 'admin@school.com' && password === 'admin') {
            return NextResponse.json({
                id: 'ADMIN-01',
                name: 'Admin User',
                email: email,
                role: 'admin',
            });
        }

        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
