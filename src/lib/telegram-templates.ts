// lib/telegramTemplates.ts

import {CustomerInfo, ItemInfo} from "@/types/types";

export function inventoryAlertTemplate(alerts: { name: string, remaining: number, threshold: number }[]) {
    const header = `\u26a0\ufe0f *התראת מצאי*\n`;
    const body = alerts
        .map(({name, remaining, threshold}) =>
            `• ${name}: ${remaining / 1000}) קילו ${threshold / 1000})`
        )
        .join("\n");
    return header + body;
}

export function orderAlertTemplate(customer: CustomerInfo, order: any, items: ItemInfo[]) {
    return `יש הזמנה חדשה!\n` +
        `מ: ${customer.name}\n` +
        `טלפון: ${customer.phone}\n` +
        `לתאריך: ${order.date}\n` +
        `סה\"כ לתשלום: ₪${order.total_price}\n\n` +
        `פרטי ההזמנה:\n` +
        items.map(i => `• ${i.title} x${i.quantity}`).join('\n') + '\n\n' +
        `הערות: ${customer.notes || ''}`;
}
