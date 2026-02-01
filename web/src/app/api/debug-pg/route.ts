
import { NextResponse } from 'next/server';
import { Client } from 'pg';

export const dynamic = 'force-dynamic';

export async function GET() {
    const url = process.env.DATABASE_URL;
    if (!url) {
        return NextResponse.json({ error: 'No DATABASE_URL ' }, { status: 500 });
    }

    const client = new Client({
        connectionString: url,
        ssl: { rejectUnauthorized: false } // Crucial for Supabase sometimes
    });

    try {
        console.log("Testing PG connection to:", url.split('@')[1]);
        const maskedUrl = url.replace(/:[^:]*@/, ':****@');
        console.log("Full URL (Masked):", maskedUrl);
        console.log("URL Length:", url.length);
        console.log("First char code:", url.charCodeAt(0));
        console.log("Last char code:", url.charCodeAt(url.length - 1));

        await client.connect();
        const res = await client.query('SELECT NOW() as time');
        await client.end();

        return NextResponse.json({
            status: 'success',
            time: res.rows[0].time,
            driver: 'node-postgres'
        });
    } catch (e: any) {
        const maskedUrl = url.replace(/:[^:]*@/, ':****@');
        return NextResponse.json({
            status: 'error',
            message: e.message,
            stack: e.stack,
            driver: 'node-postgres',
            debugConfig: {
                maskedUrl,
                length: url.length,
                firstChar: url.charCodeAt(0),
                lastChar: url.charCodeAt(url.length - 1)
            }
        }, { status: 500 });
    }
}
