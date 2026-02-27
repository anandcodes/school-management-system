import { NextResponse } from 'next/server';
import dbConnect from '@/backend/db';
import { AttendanceRecord } from '@/backend/models';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        // body expected: { classId, date, attendance: [{ studentId, status, remarks? }] }

        const { classId, date, attendance } = body;

        if (!date || !attendance || !Array.isArray(attendance)) {
            return NextResponse.json(
                { error: 'Invalid request body. Expected date and attendance array.' },
                { status: 400 }
            );
        }

        const attendanceDate = new Date(date);

        // Save individual attendance records
        const createdRecords = [];

        for (const record of attendance) {
            const { studentId, status, remarks } = record;

            if (!studentId || !status) {
                continue; // Skip invalid records
            }

            // Check if record for this student on this date already exists
            const dayStart = new Date(attendanceDate);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(attendanceDate);
            dayEnd.setHours(23, 59, 59, 999);

            const existing = await AttendanceRecord.findOne({
                studentId,
                date: {
                    $gte: dayStart,
                    $lt: dayEnd,
                },
            });

            if (existing) {
                // Update existing record
                const updated = await AttendanceRecord.findByIdAndUpdate(
                    existing._id,
                    {
                        status: status.toUpperCase(),
                        remarks: remarks || null,
                    },
                    { new: true }
                ).lean();
                createdRecords.push({ ...updated, id: (updated as any)._id.toString() });
            } else {
                // Create new record
                const created = await AttendanceRecord.create({
                    studentId,
                    status: status.toUpperCase(),
                    date: new Date(date),
                    remarks: remarks || null,
                });
                createdRecords.push({ ...created.toObject(), id: created._id.toString() });
            }
        }

        return NextResponse.json({
            success: true,
            message: `Attendance saved for ${createdRecords.length} students`,
            records: createdRecords,
        });
    } catch (error: any) {
        console.error('Attendance save error:', error);
        return NextResponse.json(
            { error: 'Failed to save attendance', details: error.message },
            { status: 500 }
        );
    }
}
