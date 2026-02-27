import { NextResponse } from 'next/server';
import dbConnect from '@/backend/db';
import { FeeRecord, Student } from '@/backend/models';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');
    const search = searchParams.get('search');
    const status = searchParams.get('status');

    try {
        await dbConnect();

        if (pageParam && limitParam) {
            const page = parseInt(pageParam);
            const limit = parseInt(limitParam);
            const skip = (page - 1) * limit;

            const filter: any = {};

            if (search) {
                // Find students matching the search, then filter fees by those student IDs
                const matchingStudents = await Student.find({
                    name: { $regex: search, $options: 'i' },
                }).select('_id').lean();
                const studentIds = matchingStudents.map((s: any) => s._id);
                filter.studentId = { $in: studentIds };
            }
            if (status && status !== 'All') {
                filter.status = status;
            }

            const [fees, total] = await Promise.all([
                FeeRecord.find(filter)
                    .populate('studentId')
                    .sort({ dueDate: 1 })
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                FeeRecord.countDocuments(filter),
            ]);

            const formattedFees = fees.map((fee: any) => ({
                ...fee,
                id: fee._id.toString(),
                student: fee.studentId || null,
                studentName: fee.studentId?.name || '',
                dueDate: fee.dueDate ? new Date(fee.dueDate).toISOString().split('T')[0] : '',
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
            const fees = await FeeRecord.find()
                .populate('studentId')
                .sort({ dueDate: 1 })
                .lean();

            const formattedFees = fees.map((fee: any) => ({
                ...fee,
                id: fee._id.toString(),
                student: fee.studentId || null,
                studentName: fee.studentId?.name || '',
                dueDate: fee.dueDate ? new Date(fee.dueDate).toISOString().split('T')[0] : '',
            }));

            return NextResponse.json(formattedFees);
        }
    } catch (error) {
        console.error("Failed to fetch fees:", error);
        return NextResponse.json({ error: 'Failed to fetch fees' }, { status: 500 });
    }
}
