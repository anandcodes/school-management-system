import { NextResponse } from 'next/server';
import dbConnect from '@/backend/db';
import { Student } from '@/backend/models';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    try {
        await dbConnect();

        if (pageParam && limitParam) {
            const page = parseInt(pageParam);
            const limit = parseInt(limitParam);
            const skip = (page - 1) * limit;

            // Build filter conditions
            const filter: any = {};
            if (search) {
                filter.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                ];
            }
            if (status && status !== 'All') {
                filter.status = status;
            }

            const [students, total] = await Promise.all([
                Student.find(filter)
                    .populate('classId')
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                Student.countDocuments(filter),
            ]);

            const formatted = students.map((s: any) => ({
                ...s,
                id: s._id.toString(),
                class: s.classId || null,
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
            // Return all students (Backward compatibility for Mobile App)
            const students = await Student.find()
                .populate('classId')
                .sort({ createdAt: -1 })
                .lean();

            const formatted = students.map((s: any) => ({
                ...s,
                id: s._id.toString(),
                class: s.classId || null,
            }));

            return NextResponse.json(formatted);
        }
    } catch (error) {
        console.error("Failed to fetch students:", error);
        return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const student = await Student.create({
            name: body.name,
            email: body.email,
            grade: body.grade,
            status: body.status || 'ACTIVE',
            classId: body.classId,
        });
        return NextResponse.json({ ...student.toObject(), id: student._id.toString() });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
    }
}
