// src/lib/telegram.ts

export async function sendTelegramMessage(text: string, timeoutMs = 5000) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    console.log("[Telegram] Sending message:", text);
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
            const errorText = await telegramRes.text();
            console.error("[Telegram] Telegram response NOT OK:", telegramRes.status, errorText);
            return { success: false, error: errorText };
        }

        const data = await telegramRes.json();
        console.log("[Telegram] Message sent:", data);
        return { success: true, data };

    } catch (error) {
        clearTimeout(timeout);
        console.error("[Telegram] Error sending message:", error);
        return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
}

export async function sendTelegramWithRetries(
    text: string,
    retries = 3,
    delayMs = 1000
) {
    let attempt = 0;
    let result;

    while (attempt < retries) {
        result = await sendTelegramMessage(text);
        if (result.success) return result;

        attempt++;
        console.warn(`[Telegram] Retry ${attempt}/${retries}`);
        await new Promise((r) => setTimeout(r, delayMs));
    }

    return result ?? { success: false, error: 'Unknown failure' };
}

