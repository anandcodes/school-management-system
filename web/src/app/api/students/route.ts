import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    try {
        if (pageParam && limitParam) {
            const page = parseInt(pageParam);
            const limit = parseInt(limitParam);
            const skip = (page - 1) * limit;

            // Build filter conditions
            const where: any = {};
            if (search) {
                where.OR = [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ];
            }
            if (status && status !== 'All') {
                where.status = status;
            }

            const [students, total] = await prisma.$transaction([
                prisma.student.findMany({
                    skip,
                    take: limit,
                    where,
                    include: { class: true },
                    orderBy: { createdAt: 'desc' as any },
                }),
                prisma.student.count({ where }),
            ]);

            return NextResponse.json({
                data: students,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            });
        } else {
            // Return all students (Backward compatibility for Mobile App)
            const students = await prisma.student.findMany({
                include: {
                    class: true,
                },
                orderBy: { createdAt: 'desc' as any },
            });
            return NextResponse.json(students);
        }
    } catch (error) {
        console.error("Failed to fetch students:", error);
        return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const student = await prisma.student.create({
            data: {
                name: body.name,
                email: body.email,
                grade: body.grade,
                status: body.status || 'ACTIVE',
                classId: body.classId,
            },
        });
        return NextResponse.json(student);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create student' }, { status: 500 });
    }
}
