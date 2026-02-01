import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const student = await prisma.student.findUnique({
            where: { id },
            include: { class: true },
        });

        if (!student) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }

        return NextResponse.json(student);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const student = await prisma.student.update({
            where: { id },
            data: {
                name: body.name,
                email: body.email,
                grade: body.grade,
                status: body.status,
                classId: body.classId || null,
            },
        });

        return NextResponse.json(student);
    } catch (error: any) {
        console.error('Student update error:', error);
        return NextResponse.json(
            { error: 'Failed to update student', details: error.message },
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

        // Delete related records first to avoid foreign key constraints
        await prisma.attendanceRecord.deleteMany({
            where: { studentId: id },
        });

        await prisma.examResult.deleteMany({
            where: { studentId: id },
        });

        await prisma.feeRecord.deleteMany({
            where: { studentId: id },
        });

        // Now delete the student
        await prisma.student.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, message: 'Student deleted successfully' });
    } catch (error: any) {
        console.error('Student delete error:', error);
        return NextResponse.json(
            { error: 'Failed to delete student', details: error.message },
            { status: 500 }
        );
    }
}
