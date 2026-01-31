import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const exams = await prisma.exam.findMany({
            include: {
                class: true,
            },
            orderBy: {
                date: 'desc',
            },
        });
        return NextResponse.json(exams);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch exams' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const exam = await prisma.exam.create({
            data: {
                title: body.title,
                subject: body.subject,
                date: new Date(body.date),
                totalMarks: body.totalMarks,
                classId: body.classId,
            },
        });
        return NextResponse.json(exam);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create exam' }, { status: 500 });
    }
}
