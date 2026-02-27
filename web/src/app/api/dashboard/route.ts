import { NextResponse } from 'next/server';
import dbConnect from '@/backend/db';
import { Student, Teacher, SchoolClass } from '@/backend/models';

export async function GET() {
    try {
        await dbConnect();

        const [studentsCount, teachersCount, classesCount] = await Promise.all([
            Student.countDocuments(),
            Teacher.countDocuments(),
            SchoolClass.countDocuments(),
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
