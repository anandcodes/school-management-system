import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const fees = await prisma.feeRecord.findMany({
            include: {
                student: true,
            },
            orderBy: {
                dueDate: 'asc',
            },
        });

        // Transform specifically for mobile app if needed, or send raw
        const formattedFees = fees.map(fee => ({
            ...fee,
            studentName: fee.student.name,
            dueDate: fee.dueDate.toISOString().split('T')[0], // YYYY-MM-DD
        }));

        return NextResponse.json(formattedFees);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch fees' }, { status: 500 });
    }
}
