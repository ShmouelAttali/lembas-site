import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const body = await req.json();
    const { chat_id, text } = body;

    const telegramRes = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id, text }),
    });

    const data = await telegramRes.json();

    return NextResponse.json(data);
}