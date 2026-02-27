import { NextResponse } from 'next/server';
import dbConnect from '@/backend/db';
import { ScheduleEvent, Teacher } from '@/backend/models';

export async function GET() {
    try {
        await dbConnect();
        const events = await ScheduleEvent.find().populate('teacherId').lean();

        const formatted = events.map((e: any) => ({
            ...e,
            id: e._id.toString(),
            teacher: e.teacherId || null,
        }));

        return NextResponse.json(formatted);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch schedule' }, { status: 500 });
    }
}
