import { NextResponse } from 'next/server';
import dbConnect from '@/backend/db';
import { Teacher, SchoolClass, ScheduleEvent } from '@/backend/models';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const teacher = await Teacher.findById(id).lean();

        if (!teacher) {
            return NextResponse.json({ error: 'Teacher not found' }, { status: 404 });
        }

        const classes = await SchoolClass.find({ teacherId: id }).lean();
        const events = await ScheduleEvent.find({ teacherId: id }).lean();

        return NextResponse.json({
            ...teacher,
            id: (teacher as any)._id.toString(),
            classes: classes.map((c: any) => ({ ...c, id: c._id.toString() })),
            events: events.map((e: any) => ({ ...e, id: e._id.toString() })),
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch teacher' }, { status: 500 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await request.json();

        const teacher = await Teacher.findByIdAndUpdate(
            id,
            {
                name: body.name,
                email: body.email,
                subject: body.subject,
                avatar: body.avatar || null,
            },
            { new: true }
        ).lean();

        return NextResponse.json({ ...teacher, id: (teacher as any)._id.toString() });
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
        await dbConnect();
        const { id } = await params;

        // Delete related schedule events
        await ScheduleEvent.deleteMany({ teacherId: id });

        // Unlink classes (unset teacherId)
        await SchoolClass.updateMany(
            { teacherId: id },
            { $unset: { teacherId: 1 } }
        );

        // Now delete the teacher
        await Teacher.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: 'Teacher deleted successfully' });
    } catch (error: any) {
        console.error('Teacher delete error:', error);
        return NextResponse.json(
            { error: 'Failed to delete teacher', details: error.message },
            { status: 500 }
        );
    }
}
