import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const students = await prisma.student.findMany({
            include: {
                class: true,
            },
        });
        return NextResponse.json(students);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const student = await prisma.student.create({
            data: {
                name: body.name,
                email: body.email,
                grade: body.grade,
                status: body.status || 'ACTIVE',
                classId: body.classId,
            },
        });
        return NextResponse.json(student);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
    }
}
