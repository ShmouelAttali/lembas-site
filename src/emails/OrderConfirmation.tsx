// src/emails/OrderConfirmation.tsx
import * as React from 'react';
import {CustomerInfo, ItemInfo, OrderInfo} from "@/types/types";
import {getFormattedDateLabel} from "@/app/utils";

export function OrderConfirmation({
                                      customer,
                                      order,
                                      items,
                                  }: {
    customer: CustomerInfo;
    order: OrderInfo;
    items: ItemInfo[];
}) {
    // 1. טקסט פריסה / אי-פריסה
    const sliceText = customer.slice ? 'פרוס' : 'לא פרוס';

    // 2. סוג מימוש
    const fulfillmentLine =
        customer.fulfillment === 'delivery'
            ? `בחרת במשלוח לכתובת: ${customer.address ?? '—'}`
            : 'בחרת באיסוף עצמי';

    // 3. תאריך בעברית (משתמש באותו util שלך)
    const dateHe = getFormattedDateLabel(customer.orderDate);
    console.log('למייל', items);
    return (
        <div
            dir="rtl"
            style={{fontFamily: 'Arial, Helvetica, sans-serif', lineHeight: 1.6}}
        >
            <h1>
                {customer.name}, איזה כיף  – הזמנה מספר {order.id} התקבלה בהצלחה!
            </h1>

            <h2>פרטי ההזמנה:</h2>
            <ul style={{padding: 0, listStyle: 'none'}}>
                {items.map((i) => (
                    <li key={i.id}>
                        {i.quantity} * {i.title} – {sliceText}
                    </li>
                ))}
            </ul>

            <p>{fulfillmentLine}</p>
            <p>בתאריך {dateHe}</p>

            <p>
                <strong>סך הכול לתשלום: ₪{order.total_price.toFixed(2)}</strong>
            </p>
        </div>
    );
}
