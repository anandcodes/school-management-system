import { NextResponse } from 'next/server';
import dbConnect from '@/backend/db';
import { SchoolClass, Teacher, Student, Exam, ExamResult } from '@/backend/models';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const schoolClass = await SchoolClass.findById(id).lean();

        if (!schoolClass) {
            return NextResponse.json({ error: 'Class not found' }, { status: 404 });
        }

        const teacher = (schoolClass as any).teacherId
            ? await Teacher.findById((schoolClass as any).teacherId).lean()
            : null;
        const students = await Student.find({ classId: id }).lean();
        const exams = await Exam.find({ classId: id }).lean();

        return NextResponse.json({
            ...schoolClass,
            id: (schoolClass as any)._id.toString(),
            teacher: teacher ? { ...teacher, id: (teacher as any)._id.toString() } : null,
            students: students.map((s: any) => ({ ...s, id: s._id.toString() })),
            exams: exams.map((e: any) => ({ ...e, id: e._id.toString() })),
        });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch class' }, { status: 500 });
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

        const schoolClass = await SchoolClass.findByIdAndUpdate(
            id,
            {
                name: body.name,
                grade: body.grade,
                teacherId: body.teacherId || null,
                time: body.time || null,
                days: body.days || [],
                room: body.room || null,
                color: body.color || null,
            },
            { new: true }
        ).lean();

        return NextResponse.json({ ...schoolClass, id: (schoolClass as any)._id.toString() });
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
        await dbConnect();
        const { id } = await params;

        // Delete related exams and their results
        const exams = await Exam.find({ classId: id }).lean();

        for (const exam of exams) {
            await ExamResult.deleteMany({ examId: (exam as any)._id });
        }

        await Exam.deleteMany({ classId: id });

        // Unlink students (set classId to null)
        await Student.updateMany(
            { classId: id },
            { $unset: { classId: 1 } }
        );

        // Now delete the class
        await SchoolClass.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: 'Class deleted successfully' });
    } catch (error: any) {
        console.error('Class delete error:', error);
        return NextResponse.json(
            { error: 'Failed to delete class', details: error.message },
            { status: 500 }
        );
    }
}
