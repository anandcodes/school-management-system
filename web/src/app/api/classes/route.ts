import { NextResponse } from 'next/server';
import dbConnect from '@/backend/db';
import { SchoolClass, Teacher, Student } from '@/backend/models';

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
                // For teacher name search, first find matching teacher IDs
                const matchingTeachers = await Teacher.find({
                    name: { $regex: search, $options: 'i' },
                }).select('_id').lean();
                const teacherIds = matchingTeachers.map((t: any) => t._id);

                filter.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { grade: { $regex: search, $options: 'i' } },
                    { teacherId: { $in: teacherIds } },
                ];
            }

            const [classes, total] = await Promise.all([
                SchoolClass.find(filter)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                SchoolClass.countDocuments(filter),
            ]);

            const formattedClasses = await Promise.all(
                classes.map(async (cls: any) => {
                    const teacher = cls.teacherId
                        ? await Teacher.findById(cls.teacherId).lean()
                        : null;
                    const studentsCount = await Student.countDocuments({ classId: cls._id });
                    return {
                        ...cls,
                        id: cls._id.toString(),
                        teacher: teacher ? { ...teacher, id: (teacher as any)._id.toString() } : null,
                        studentsCount,
                        teacherName: teacher ? (teacher as any).name : 'Unassigned',
                    };
                })
            );

            return NextResponse.json({
                data: formattedClasses,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            });
        } else {
            const classes = await SchoolClass.find()
                .sort({ createdAt: -1 })
                .lean();

            const formattedClasses = await Promise.all(
                classes.map(async (cls: any) => {
                    const teacher = cls.teacherId
                        ? await Teacher.findById(cls.teacherId).lean()
                        : null;
                    const studentsCount = await Student.countDocuments({ classId: cls._id });
                    return {
                        ...cls,
                        id: cls._id.toString(),
                        teacher: teacher ? { ...teacher, id: (teacher as any)._id.toString() } : null,
                        studentsCount,
                        teacherName: teacher ? (teacher as any).name : 'Unassigned',
                    };
                })
            );

            return NextResponse.json(formattedClasses);
        }
    } catch (error) {
        console.error("Failed to fetch classes:", error);
        return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const newClass = await SchoolClass.create({
            name: body.name,
            grade: body.grade,
            teacherId: body.teacherId,
            time: body.time,
            days: body.days,
            room: body.room,
            color: body.color,
        });
        return NextResponse.json({ ...newClass.toObject(), id: newClass._id.toString() });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create class' }, { status: 500 });
    }
}
