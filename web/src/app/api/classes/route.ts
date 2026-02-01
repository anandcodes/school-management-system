import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    const search = searchParams.get('search');

    try {
        if (pageParam && limitParam) {
            const page = parseInt(pageParam);
            const limit = parseInt(limitParam);
            const skip = (page - 1) * limit;

            const where: any = {};
            if (search) {
                where.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    { grade: { contains: search, mode: 'insensitive' } },
                    { teacher: { name: { contains: search, mode: 'insensitive' } } },
                ];
            }

            const [classes, total] = await prisma.$transaction([
                prisma.schoolClass.findMany({
                    skip,
                    take: limit,
                    where,
                    include: {
                        teacher: true,
                        _count: {
                            select: { students: true },
                        },
                    },
                    orderBy: { createdAt: 'desc' as any },
                }),
                prisma.schoolClass.count({ where }),
            ]);

            const formattedClasses = classes.map((cls: any) => ({
                ...cls,
                studentsCount: cls._count.students,
                teacherName: cls.teacher?.name || 'Unassigned',
            }));

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
            const classes = await prisma.schoolClass.findMany({
                include: {
                    teacher: true,
                    _count: {
                        select: { students: true },
                    },
                },
                orderBy: { createdAt: 'desc' as any },
            });

            const formattedClasses = classes.map((cls: any) => ({
                ...cls,
                studentsCount: cls._count.students,
                teacherName: cls.teacher?.name || 'Unassigned',
            }));

            return NextResponse.json(formattedClasses);
        }
    } catch (error) {
        console.error("Failed to fetch classes:", error);
        return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newClass = await prisma.schoolClass.create({
            data: {
                name: body.name,
                grade: body.grade,
                teacherId: body.teacherId,
                time: body.time,
                days: body.days,
                room: body.room,
                color: body.color,
            },
        });
        return NextResponse.json(newClass);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create class' }, { status: 500 });
    }
}
