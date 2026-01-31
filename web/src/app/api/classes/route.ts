import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const classes = await prisma.schoolClass.findMany({
            include: {
                teacher: true,
                _count: {
                    select: { students: true },
                },
            },
        });

        // Transform to match UI needs if necessary
        const formattedClasses = classes.map((cls: typeof classes[0]) => ({
            ...cls,
            studentsCount: cls._count.students,
            teacherName: cls.teacher?.name || 'Unassigned',
        }));

        return NextResponse.json(formattedClasses);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newClass = await prisma.schoolClass.create({
            data: {
                name: body.name,
                grade: body.grade,
                teacherId: body.teacherId,
                time: body.time,
                days: body.days,
                room: body.room,
                color: body.color,
            },
        });
        return NextResponse.json(newClass);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create class' }, { status: 500 });
    }
}
