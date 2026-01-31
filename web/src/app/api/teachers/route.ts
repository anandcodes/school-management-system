import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const teachers = await prisma.teacher.findMany({
            include: {
                classes: true,
            },
        });
        return NextResponse.json(teachers);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const teacher = await prisma.teacher.create({
            data: {
                name: body.name,
                email: body.email,
                subject: body.subject,
            },
        });
        return NextResponse.json(teacher);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create teacher' }, { status: 500 });
    }
}
