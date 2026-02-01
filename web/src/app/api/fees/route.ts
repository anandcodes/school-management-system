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

            const where: any = {};
            if (search) {
                where.student = { name: { contains: search, mode: 'insensitive' } };
            }
            if (status && status !== 'All') {
                where.status = status;
            }

            const [fees, total] = await prisma.$transaction([
                prisma.feeRecord.findMany({
                    skip,
                    take: limit,
                    where,
                    include: { student: true },
                    orderBy: { dueDate: 'asc' },
                }),
                prisma.feeRecord.count({ where }),
            ]);

            const formattedFees = fees.map(fee => ({
                ...fee,
                studentName: fee.student.name,
                dueDate: fee.dueDate.toISOString().split('T')[0],
            }));

            return NextResponse.json({
                data: formattedFees,
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            });
        } else {
            const fees = await prisma.feeRecord.findMany({
                include: {
                    student: true,
                },
                orderBy: {
                    dueDate: 'asc',
                },
            });

            const formattedFees = fees.map(fee => ({
                ...fee,
                studentName: fee.student.name,
                dueDate: fee.dueDate.toISOString().split('T')[0],
            }));

            return NextResponse.json(formattedFees);
        }
    } catch (error) {
        console.error("Failed to fetch fees:", error);
        return NextResponse.json({ error: 'Failed to fetch fees' }, { status: 500 });
    }
}
