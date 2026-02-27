import { NextResponse } from 'next/server';
import dbConnect from '@/backend/db';
import { User } from '@/backend/models';
import { comparePassword } from '@/backend/utils/password';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        let user = null;

        try {
            await dbConnect();
            user = await User.findOne({ email }).lean();
        } catch (dbError) {
            console.error("DB Login Error (checking fallback):", dbError);
        }

        // Check database user with hashed password
        if (user) {
            const isPasswordValid = await comparePassword(password, (user as any).password);
            if (isPasswordValid) {
                // Return user info without password
                const { password: _, ...userWithoutPassword } = user as any;
                return NextResponse.json({ ...userWithoutPassword, id: (user as any)._id.toString() });
            }
        }

        // Fallback for demo/development if DB is empty or fails
        console.log("Checking fallback credentials for:", email);
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
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Login failed' }, { status: 500 });
    }
}
