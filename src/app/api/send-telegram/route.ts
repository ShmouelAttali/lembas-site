import { NextResponse } from 'next/server';

async function sendTelegramMessage(chat_id: string, text: string) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout

    try {
        const telegramRes = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id, text }),
            signal: controller.signal,
        });

        clearTimeout(timeout);

        if (!telegramRes.ok) {
            const errorData = await telegramRes.json();
            console.error("Telegram error response:", errorData);
            return { success: false, error: errorData };
        }

        const data = await telegramRes.json();
        return { success: true, data };
    } catch (error) {
        clearTimeout(timeout);
        console.error("Error sending Telegram message:", error);
        return { success: false, error };
    }
}

export async function POST(req: Request) {
    const body = await req.json();
    const { chat_id, text, retries = 3 } = body;

    let attempt = 0;
    let result;

    while (attempt < retries) {
        result = await sendTelegramMessage(chat_id, text);
        if (result.success) break;

        attempt++;
        console.warn(`Retrying Telegram message (${attempt}/${retries})...`);
        await new Promise(r => setTimeout(r, 1000)); // wait 1 second before retry
    }

    if (!result?.success) {
        return NextResponse.json({ status: 'error', error: result?.error }, { status: 500 });
    }

    return NextResponse.json({ status: 'ok', data: result.data });
}
