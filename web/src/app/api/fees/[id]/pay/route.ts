import { NextResponse } from 'next/server';
import dbConnect from '@/backend/db';
import { FeeRecord } from '@/backend/models';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id: feeId } = await params;
        const updatedFee = await FeeRecord.findByIdAndUpdate(
            feeId,
            { status: 'PAID' },
            { new: true }
        ).lean();
        return NextResponse.json({ ...updatedFee, id: (updatedFee as any)._id.toString() });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to pay fee' }, { status: 500 });
    }
}
