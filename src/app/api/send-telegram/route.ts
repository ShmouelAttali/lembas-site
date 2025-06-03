import { NextResponse } from 'next/server';
import { sendTelegramWithRetries } from '@/lib/telegram';

export async function POST(req: Request) {
    console.log('[API] /api/send-telegram POST received');

    try {
        const body = await req.json();
        const { text, retries = 3 } = body;

        const result = await sendTelegramWithRetries(text, retries);

        if (!result?.success) {
            return NextResponse.json({ status: 'error', error: result?.error }, { status: 500 });
        }

        return NextResponse.json({ status: 'ok', data: result.data });
    } catch (err) {
        console.error('[API] Unexpected failure in /api/send-telegram:', err);
        return NextResponse.json({ status: 'error', error: 'Internal server error' }, { status: 500 });
    }
}
