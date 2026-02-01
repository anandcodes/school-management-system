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
                    { title: { contains: search, mode: 'insensitive' } },
                    { subject: { contains: search, mode: 'insensitive' } },
                ];
            }

            const [exams, total] = await prisma.$transaction([
                prisma.exam.findMany({
                    skip,
                    take: limit,
                    where,
                    include: { class: true },
                    orderBy: { date: 'desc' },
                }),
                prisma.exam.count({ where }),
            ]);

            return NextResponse.json({
                data: exams,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            });
        } else {
            const exams = await prisma.exam.findMany({
                include: {
                    class: true,
                },
                orderBy: {
                    date: 'desc',
                },
            });
            return NextResponse.json(exams);
        }
    } catch (error) {
        console.error("Failed to fetch exams:", error);
        return NextResponse.json({ error: 'Failed to fetch exams' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const exam = await prisma.exam.create({
            data: {
                title: body.title,
                subject: body.subject,
                date: new Date(body.date),
                totalMarks: body.totalMarks,
                classId: body.classId,
            },
        });
        return NextResponse.json(exam);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create exam' }, { status: 500 });
    }
}
