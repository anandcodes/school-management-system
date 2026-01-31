import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const [studentsCount, teachersCount, classesCount] = await Promise.all([
            prisma.student.count(),
            prisma.teacher.count(),
            prisma.schoolClass.count(),
        ]);

        return NextResponse.json({
            totalStudents: studentsCount,
            totalTeachers: teachersCount,
            totalClasses: classesCount,
            attendanceRate: 98.5, // Mock for now, requires complex query
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
