import { NextResponse } from 'next/server';
import dbConnect from '@/backend/db';
import { Teacher, SchoolClass } from '@/backend/models';

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
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { subject: { $regex: search, $options: 'i' } },
                ];
            }

            const [teachers, total] = await Promise.all([
                Teacher.find(filter)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                Teacher.countDocuments(filter),
            ]);

            // For each teacher, fetch their classes
            const teachersWithClasses = await Promise.all(
                teachers.map(async (t: any) => {
                    const classes = await SchoolClass.find({ teacherId: t._id }).lean();
                    return {
                        ...t,
                        id: t._id.toString(),
                        classes: classes.map((c: any) => ({ ...c, id: c._id.toString() })),
                    };
                })
            );

            return NextResponse.json({
                data: teachersWithClasses,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            });
        } else {
            const teachers = await Teacher.find()
                .sort({ createdAt: -1 })
                .lean();

            const teachersWithClasses = await Promise.all(
                teachers.map(async (t: any) => {
                    const classes = await SchoolClass.find({ teacherId: t._id }).lean();
                    return {
                        ...t,
                        id: t._id.toString(),
                        classes: classes.map((c: any) => ({ ...c, id: c._id.toString() })),
                    };
                })
            );

            return NextResponse.json(teachersWithClasses);
        }
    } catch (error) {
        console.error("Failed to fetch teachers:", error);
        return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const teacher = await Teacher.create({
            name: body.name,
            email: body.email,
            subject: body.subject,
        });
        return NextResponse.json({ ...teacher.toObject(), id: teacher._id.toString() });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create teacher' }, { status: 500 });
    }
}
