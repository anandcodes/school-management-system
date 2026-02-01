import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const teacher = await prisma.teacher.findUnique({
            where: { id },
            include: {
                classes: true,
                events: true,
            },
        });

        if (!teacher) {
            return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
        }

        return NextResponse.json(teacher);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch teacher' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        const teacher = await prisma.teacher.update({
            where: { id },
            data: {
                name: body.name,
                email: body.email,
                subject: body.subject,
                avatar: body.avatar || null,
            },
        });

        return NextResponse.json(teacher);
    } catch (error: any) {
        console.error('Teacher update error:', error);
        return NextResponse.json(
            { error: 'Failed to update teacher', details: error.message },
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

        // Delete related schedule events
        await prisma.scheduleEvent.deleteMany({
            where: { teacherId: id },
        });

        // Unlink classes (set teacherId to null instead of deleting)
        await prisma.schoolClass.updateMany({
            where: { teacherId: id },
            data: { teacherId: null },
        });

        // Now delete the teacher
        await prisma.teacher.delete({
            where: { id },
        });

        return NextResponse.json({ success: true, message: 'Teacher deleted successfully' });
    } catch (error: any) {
        console.error('Teacher delete error:', error);
        return NextResponse.json(
            { error: 'Failed to delete teacher', details: error.message },
            { status: 500 }
        );
    }
}
