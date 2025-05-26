import {fulfillmentLines, getFormattedDateLabel, toE164} from "@/lib/utils"
import {CustomerInfo, ItemInfo, OrderInfo} from "@/types/types";
import {sendSms} from "@/app/api/orders/upsendSender";


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
    const fulfillmentLine = fulfillmentLines[customer.fulfillment](customer);

    // 3. תאריך בעברית
    const dateHe = getFormattedDateLabel(customer.orderDate);

    // 4. בניית ההודעה
    return ` ${customer.name}, איזה כיף! – הזמנה מספר ${order.id} התקבלה בהצלחה!
פרטי ההזמנה:
${itemsLines}
${fulfillmentLine}
ביום ${dateHe}
סך הכול לתשלום: ₪${order.total_price.toFixed(2)}`;
}

export function sendSmsNotification(customer: CustomerInfo, order: OrderInfo, items: ItemInfo[]) {
    const message = buildOrderMessage(customer, order, items)
    sendSms(message, toE164(customer.phone));

}