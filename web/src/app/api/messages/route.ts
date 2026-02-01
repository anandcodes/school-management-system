import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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
    } catch (error: any) {
        console.error('GET /api/messages DB Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch messages', details: error.message },
            { status: 500 }
        );
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
