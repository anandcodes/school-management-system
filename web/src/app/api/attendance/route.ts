import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
    try {
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
            const existing = await prisma.attendanceRecord.findFirst({
                where: {
                    studentId,
                    date: {
                        gte: new Date(attendanceDate.setHours(0, 0, 0, 0)),
                        lt: new Date(attendanceDate.setHours(23, 59, 59, 999)),
                    },
                },
            });

            if (existing) {
                // Update existing record
                const updated = await prisma.attendanceRecord.update({
                    where: { id: existing.id },
                    data: {
                        status: status.toUpperCase(),
                        remarks: remarks || null,
                    },
                });
                createdRecords.push(updated);
            } else {
                // Create new record
                const created = await prisma.attendanceRecord.create({
                    data: {
                        studentId,
                        status: status.toUpperCase(),
                        date: new Date(date),
                        remarks: remarks || null,
                    },
                });
                createdRecords.push(created);
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
