import React from 'react';
import styles from "./OrderSummary.module.css";

export function OrderSummary({items, itemsPrice}: {
    items: { id: string, title: string, quantity: number, price: number }[],
    itemsPrice: number
}) {
    return (
        <>
            <ul className={styles.OrderSummary_6}>
                {items.map((item: { id: string, title: string, quantity: number, price: number }) => (
                    <li key={item.id} className={styles.OrderSummary_8}>
                        <span>{item.title} × {item.quantity}</span>
                        <span>₪{(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                ))}
            </ul>

            <div className={styles.OrderSummary_15}>
                סה״כ לתשלום פריטים: <strong>₪{itemsPrice.toFixed(2)}</strong>
            </div>
        </>
    );
}
