import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const schoolClass = await prisma.schoolClass.findUnique({
            where: { id },
            include: {
                teacher: true,
                students: true,
                exams: true,
            },
        });

        if (!schoolClass) {
            return NextResponse.json({ error: 'Class not found' }, { status: 404 });
        }

        return NextResponse.json(schoolClass);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch class' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const schoolClass = await prisma.schoolClass.update({
            where: { id },
            data: {
                name: body.name,
                grade: body.grade,
                teacherId: body.teacherId || null,
                time: body.time || null,
                days: body.days || [],
                room: body.room || null,
                color: body.color || null,
            },
        });

        return NextResponse.json(schoolClass);
    } catch (error: any) {
        console.error('Class update error:', error);
        return NextResponse.json(
            { error: 'Failed to update class', details: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Delete related exams and their results
        const exams = await prisma.exam.findMany({
            where: { classId: id },
        });

        for (const exam of exams) {
            await prisma.examResult.deleteMany({
                where: { examId: exam.id },
            });
        }

        await prisma.exam.deleteMany({
            where: { classId: id },
        });

        // Unlink students (set classId to null)
        await prisma.student.updateMany({
            where: { classId: id },
            data: { classId: null },
        });

        // Now delete the class
        await prisma.schoolClass.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, message: 'Class deleted successfully' });
    } catch (error: any) {
        console.error('Class delete error:', error);
        return NextResponse.json(
            { error: 'Failed to delete class', details: error.message },
            { status: 500 }
        );
    }
}
