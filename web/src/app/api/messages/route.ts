import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// In-memory fallback
let MOCK_MESSAGES: any[] = [
    { id: '1', senderId: 'ADMIN-01', receiverId: 'ST-001', content: 'Welcome to the school!', createdAt: new Date().toISOString(), read: false },
    { id: '2', senderId: 'ST-001', receiverId: 'ADMIN-01', content: 'Thank you!', createdAt: new Date().toISOString(), read: true }
];

// Get messages for a specific user (either sent by them or received by them)
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'UserId required' }, { status: 400 });
    }


    try {
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId },
                ],
            },
            orderBy: {
                createdAt: 'asc',
            },
        });
        return NextResponse.json(messages);
    } catch (error) {
        console.error('DB Error, using fallback:', error);
        // Fallback
        const userMessages = MOCK_MESSAGES
            .filter(m => m.senderId === userId || m.receiverId === userId)
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        return NextResponse.json(userMessages);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body || !body.senderId || !body.receiverId || !body.content) {
            console.error('Invalid message payload:', body);
            return NextResponse.json(
                { error: 'Missing required fields: senderId, receiverId, content' },
                { status: 400 }
            );
        }

        try {
            // Try DB first
            const message = await prisma.message.create({
                data: {
                    senderId: body.senderId,
                    receiverId: body.receiverId,
                    content: body.content,
                },
            });
            return NextResponse.json(message);
        } catch (dbError: any) {
            console.error('DB Error - Failed to save message:', dbError);
            return NextResponse.json(
                {
                    error: 'Database connection failed',
                    details: dbError.message
                },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error('POST /api/messages Error:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
