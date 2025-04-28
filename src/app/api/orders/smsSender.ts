import {getFormattedDateLabel, toE164} from "@/app/utils";
import twilio from "twilio";
import {CustomerInfo, ItemInfo, OrderInfo} from "@/types/types";

const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
);

export function buildOrderMessage(
    customer: CustomerInfo,
    order: OrderInfo,
    items: ItemInfo[],
):
    string {
    // 1. רשימת המוצרים
    const sliceText = customer.slice ? 'פרוס' : 'לא פרוס';
    const itemsLines = items
        .map(i => `${i.quantity} × ${i.title} – ${sliceText}`)
        .join('\n');

    // 2. סוג מימוש (משלוח / איסוף)
    const fulfillmentLine =
        customer.fulfillment === 'delivery'
            ? `בחרת במשלוח לכתובת: ${customer.address ?? '—'}`
            : 'בחרת באיסוף עצמי';

    // 3. תאריך בעברית
    const dateHe = getFormattedDateLabel(customer.orderDate);

    // 4. בניית ההודעה
    return ` ${customer.name}, איזה כיף! – הזמנה מספר ${order.id} התקבלה בהצלחה!
פרטי ההזמנה:
${itemsLines}
${fulfillmentLine}
בתאריך ${dateHe}
סך הכול לתשלום: ₪${order.total_price.toFixed(2)}`;
}

export function sendSmsNotification(customer: CustomerInfo, order: OrderInfo, items: ItemInfo[]) {
    const message = buildOrderMessage(customer, order, items)
    twilioClient.messages
        .create({
            body: message,
            messagingServiceSid: process.env.TWILIO_MESSAGING_SERVICE_SID,
            to: toE164(customer.phone),
        })
        .catch(console.error);
}