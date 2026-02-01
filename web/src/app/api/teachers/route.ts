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
                    { email: { contains: search, mode: 'insensitive' } },
                    { subject: { contains: search, mode: 'insensitive' } },
                ];
            }

            const [teachers, total] = await prisma.$transaction([
                prisma.teacher.findMany({
                    skip,
                    take: limit,
                    where,
                    include: { classes: true },
                    orderBy: { createdAt: 'desc' as any },
                }),
                prisma.teacher.count({ where }),
            ]);

            return NextResponse.json({
                data: teachers,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            });
        } else {
            const teachers = await prisma.teacher.findMany({
                include: {
                    classes: true,
                },
                orderBy: { createdAt: 'desc' as any },
            });
            return NextResponse.json(teachers);
        }
    } catch (error) {
        console.error("Failed to fetch teachers:", error);
        return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const teacher = await prisma.teacher.create({
            data: {
                name: body.name,
                email: body.email,
                subject: body.subject,
            },
        });
        return NextResponse.json(teacher);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create teacher' }, { status: 500 });
    }
}
