import { NextResponse } from 'next/server';
import { sendTelegramWithRetries } from '@/lib/telegram';
import { supabaseServer } from '@/lib/supabase-server';
import { requireAdmin } from '@/lib/api-auth';

export async function POST(req: Request) {
    // Only the admin inventory screen calls this route.
    const supabase = await supabaseServer();
    const denied = await requireAdmin(supabase);
    if (denied) return denied;

    try {
        const body = await req.json();
        const { text } = body;
        const retries = Math.min(Math.max(Number(body.retries ?? 3) || 3, 1), 3);

        if (typeof text !== 'string' || text.length === 0 || text.length > 4000) {
            return NextResponse.json({ status: 'error', error: 'Invalid text' }, { status: 400 });
        }

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
