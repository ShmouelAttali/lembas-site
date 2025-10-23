import {HDate} from "@hebcal/core";
import {CustomerInfo, FulfillmentMethods} from "@/types/types";

export function getFormattedDateLabel(d: Date, onlyDayOfWeek = false) {
    const weekdayFmt = new Intl.DateTimeFormat('he-IL', {weekday: 'long'});
    const gregFmt = new Intl.DateTimeFormat('he-IL', {day: '2-digit', month: '2-digit'});
    const weekday = weekdayFmt.format(d).replace(/^יום\s*/, '');
    const hd = new HDate(d);
    const [dayMon] = hd.renderGematriya(true).split(' תשפ'); // "כ"ו ניסן"
    const greg = gregFmt.format(d);
    return onlyDayOfWeek ? `${weekday}` : `${weekday} - ${dayMon} (${greg})`;
}

export function addDays(d: Date, daysToAdd: number) {
    return new Date(d.getTime() + 86_400_000 * daysToAdd);
}

export function toE164(phone: string): string {
    // Remove any non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // Israeli numbers typically start with '0' and are 10 digits
    if (cleaned.startsWith('0')) {
        return '+972' + cleaned.slice(1); // Replace 0 with +972
    }

    // Otherwise assume it's already in E.164 or invalid
    return cleaned.startsWith('+') ? cleaned : '+' + cleaned;
}

export async function sendTelegramMessage(message: string) {
    console.log(`[Client] Sending Telegram message to ${process.env.NEXT_PUBLIC_SITE_URL}/api/send-telegram...`);

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-telegram`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text: message,
                retries: 3,
            }),
        });

        console.log('[Client] HTTP status:', res.status);

        let data;
        try {
            data = await res.json();
            console.log('[Client] Telegram API response:', data);
        } catch (jsonErr) {
            console.error('[Client] Error parsing response as JSON:', jsonErr);
            const raw = await res.text();
            console.error('[Client] Raw response:', raw);
            return;
        }

        if (data.status === 'ok') {
            console.log('[Client] Telegram message sent successfully:', data.data);
        } else {
            console.error('[Client] Telegram send failed:', data.error);
        }

    } catch (err) {
        console.error('[Client] Unexpected error sending Telegram message:', err);
    }
}

export const fulfillmentLines: Record<FulfillmentMethods, (customer: CustomerInfo) => string> = {
    'delivery': (curCustomer: CustomerInfo) => `בחרת במשלוח לכתובת: ${curCustomer.address ?? '—'}`,
    'pickup': () => 'בחרת באיסוף עצמי מרחוב הקטורת 48',
    'pickup-beruchin': () => 'בחרת באיסוף עצמי מברוכין',
};



