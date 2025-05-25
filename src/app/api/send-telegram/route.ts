import { NextResponse } from 'next/server';

async function sendTelegramMessage(text: string) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    console.log("[API] Sending Telegram message:", text);
    try {
        const chat_id = process.env.TELEGRAM_CHAT_ID;
        const token = process.env.TELEGRAM_BOT_TOKEN;

        if (!chat_id || !token) {
            throw new Error("Missing TELEGRAM_CHAT_ID or TELEGRAM_BOT_TOKEN");
        }

        const telegramRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id, text }),
            signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!telegramRes.ok) {
            let errorText;
            try {
                errorText = await telegramRes.text();
            } catch (e) {
                errorText = `Unable to read error body: ${e}`;
            }
            console.error("[API] Telegram response NOT OK:", telegramRes.status, errorText);
            return { success: false, error: errorText };
        }

        const data = await telegramRes.json();
        console.log("[API] Telegram message sent:", data);
        return { success: true, data };

    } catch (error) {
        clearTimeout(timeout);
        console.error("[API] Error sending Telegram message:", error);
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

export async function POST(req: Request) {
    console.log("[API] /api/send-telegram POST received");

    try {
        const body = await req.json();
        const { text, retries = 3 } = body;

        console.log("[API] Message text:", text);
        let attempt = 0;
        let result;

        while (attempt < retries) {
            result = await sendTelegramMessage(text);
            if (result.success) break;

            attempt++;
            console.warn(`[API] Retry ${attempt}/${retries}`);
            await new Promise((r) => setTimeout(r, 1000));
        }

        if (!result?.success) {
            return NextResponse.json({ status: 'error', error: result?.error }, { status: 500 });
        }

        return NextResponse.json({ status: 'ok', data: result.data });

    } catch (err) {
        console.error("[API] Unexpected failure in /api/send-telegram:", err);
        return NextResponse.json({ status: 'error', error: 'Internal server error' }, { status: 500 });
    }
}
