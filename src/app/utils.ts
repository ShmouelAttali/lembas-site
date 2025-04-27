import {HDate} from "@hebcal/core";
import {CustomerInfo, ItemInfo, OrderInfo} from "@/types/types";

export function getFormattedDateLabel(d: Date) {
    const weekdayFmt = new Intl.DateTimeFormat('he-IL', {weekday: 'long'});
    const gregFmt = new Intl.DateTimeFormat(undefined, {day: '2-digit', month: '2-digit'});
    const weekday = weekdayFmt.format(d).replace(/^יום\s*/, '');
    const hd = new HDate(d);
    const [dayMon] = hd.renderGematriya(true).split(' תש'); // "כ"ו ניסן"
    const greg = gregFmt.format(d);
    return `${weekday} - ${dayMon} (${greg})`;
}

export function getNextMDates(n: number) {
    const out: { date: Date; label: string }[] = [];
    let d = new Date();
    d.setHours(0, 0, 0, 0);

    while (out.length < n) {
        d = new Date(d.getTime() + 86_400_000);
        if (d.getDay() === 1 || d.getDay() === 4) {
            let label = getFormattedDateLabel(d);
            out.push({date: d, label: label});
        }
    }
    return out;
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

export function sendOrderTelegram(customer: CustomerInfo, order: OrderInfo, items: ItemInfo[]) {
    /* 4 . Send Telegram */
    const telegramMessage = `יש הזמנה חדשה!\n` +
        `מ: ${customer.name}\n` +
        `טלפון: ${customer.phone}\n` +
        `לתאריך: ${getFormattedDateLabel(customer.orderDate)}\n` +
        `סה"כ לתשלום: ₪${order.total_price}\n\n` +
        `פרטי ההזמנה:\n` +
        items.map((i: ItemInfo) => `• ${i.title} x${i.quantity}`).join('\n') + '\n\n' +
        `הערות: ${customer.notes || ''}`;

    const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=${process.env.TELEGRAM_CHAT_ID}&text=${encodeURIComponent(telegramMessage)}`;

    fetch(telegramUrl)
        .then(response => response.json())
        .then(data => console.log('Telegram response:', data))
        .catch(error => console.error('Error sending Telegram message:', error));
}
