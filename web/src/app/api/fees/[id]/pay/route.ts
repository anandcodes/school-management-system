import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const feeId = params.id;
        const updatedFee = await prisma.feeRecord.update({
            where: { id: feeId },
            data: { status: 'PAID' },
        });
        return NextResponse.json(updatedFee);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to pay fee' }, { status: 500 });
    }
}
