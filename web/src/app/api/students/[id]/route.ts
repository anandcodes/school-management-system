import { NextResponse } from 'next/server';
import dbConnect from '@/backend/db';
import { Student, AttendanceRecord, ExamResult, FeeRecord } from '@/backend/models';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const student = await Student.findById(id).populate('classId').lean();

        if (!student) {
            return NextResponse.json({ error: 'Student not found' }, { status: 404 });
        }

        return NextResponse.json({ ...student, id: (student as any)._id.toString(), class: (student as any).classId || null });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch student' }, { status: 500 });
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

        const student = await Student.findByIdAndUpdate(
            id,
            {
                name: body.name,
                email: body.email,
                grade: body.grade,
                status: body.status,
                classId: body.classId || null,
            },
            { new: true }
        ).lean();

        return NextResponse.json({ ...student, id: (student as any)._id.toString() });
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
        await dbConnect();
        const { id } = await params;

        // Delete related records first
        await AttendanceRecord.deleteMany({ studentId: id });
        await ExamResult.deleteMany({ studentId: id });
        await FeeRecord.deleteMany({ studentId: id });

        // Now delete the student
        await Student.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: 'Student deleted successfully' });
    } catch (error: any) {
        console.error('Student delete error:', error);
        return NextResponse.json(
            { error: 'Failed to delete student', details: error.message },
            { status: 500 }
        );
    }
}
