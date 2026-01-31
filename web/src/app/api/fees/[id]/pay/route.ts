import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: feeId } = await params;
        const updatedFee = await prisma.feeRecord.update({
            where: { id: feeId },
            data: { status: 'PAID' },
        });
        return NextResponse.json(updatedFee);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to pay fee' }, { status: 500 });
    }
}
