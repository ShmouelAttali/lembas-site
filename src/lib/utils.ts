import {HDate} from "@hebcal/core";
import {CustomerInfo, ItemInfo, OrderInfo} from "@/types/types";

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

export async function sendOrderTelegram(customer: CustomerInfo, order: OrderInfo, items: ItemInfo[]) {

    const telegramMessage = `יש הזמנה חדשה!\n` +
        `מ: ${customer.name}\n` +
        `טלפון: ${customer.phone}\n` +
        `לתאריך: ${getFormattedDateLabel(customer.orderDate)}\n` +
        `סה"כ לתשלום: ₪${order.total_price}\n\n` +
        `פרטי ההזמנה:\n` +
        items.map((i: ItemInfo) => `• ${i.title} x${i.quantity}`).join('\n') + '\n\n' +
        `הערות: ${customer.notes || ''}`;

    console.log('Sending Telegram message...');

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/send-telegram`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: process.env.TELEGRAM_CHAT_ID,
                text: telegramMessage,
                retries: 3,
            }),
        });

        console.log('HTTP status:', res.status);
        const data = await res.json();
        console.log('Telegram API response:', data);

        if (data.status === 'ok') {
            console.log('Telegram message sent successfully:', data.data);
        } else {
            console.error('Failed to send Telegram message:', data.error);
        }
    } catch (err) {
        console.error("Unexpected error sending Telegram message:", err);
    }
}


