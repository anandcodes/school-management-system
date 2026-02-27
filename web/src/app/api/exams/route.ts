import { NextResponse } from 'next/server';
import dbConnect from '@/backend/db';
import { Exam, SchoolClass } from '@/backend/models';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    const search = searchParams.get('search');

    try {
        await dbConnect();

        if (pageParam && limitParam) {
            const page = parseInt(pageParam);
            const limit = parseInt(limitParam);
            const skip = (page - 1) * limit;

            const filter: any = {};
            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { subject: { $regex: search, $options: 'i' } },
                ];
            }

            const [exams, total] = await Promise.all([
                Exam.find(filter)
                    .populate('classId')
                    .sort({ date: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                Exam.countDocuments(filter),
            ]);

            const formatted = exams.map((e: any) => ({
                ...e,
                id: e._id.toString(),
                class: e.classId || null,
            }));

            return NextResponse.json({
                data: formatted,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            });
        } else {
            const exams = await Exam.find()
                .populate('classId')
                .sort({ date: -1 })
                .lean();

            const formatted = exams.map((e: any) => ({
                ...e,
                id: e._id.toString(),
                class: e.classId || null,
            }));

            return NextResponse.json(formatted);
        }
    } catch (error) {
        console.error("Failed to fetch exams:", error);
        return NextResponse.json({ error: 'Failed to fetch exams' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const exam = await Exam.create({
            title: body.title,
            subject: body.subject,
            date: new Date(body.date),
            totalMarks: body.totalMarks,
            classId: body.classId,
        });
        return NextResponse.json({ ...exam.toObject(), id: exam._id.toString() });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create exam' }, { status: 500 });
    }
}
