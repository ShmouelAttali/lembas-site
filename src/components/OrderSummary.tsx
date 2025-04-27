import React from 'react';

export function OrderSummary({ items, itemsPrice, shippingFee, totalPrice }: { items: { id: string, title: string, quantity: number, price: number }[], itemsPrice: number, shippingFee: number, totalPrice: number }) {
    return (
        <>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                {items.map((item: { id: string, title: string, quantity: number, price: number }) => (
                    <li key={item.id} style={{
                        display: 'flex', justifyContent: 'space-between',
                        marginBottom: '1rem', background: 'white',
                        padding: '1rem', borderRadius: 'var(--radius)',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                    }}>
                        <span>{item.title} × {item.quantity}</span>
                        <span>₪{(item.price * item.quantity).toFixed(2)}</span>
                    </li>
                ))}
            </ul>

            <div style={{ fontSize: '1.25rem', marginBottom: '2rem' }}>
                סה״כ לתשלום פריטים: <strong>₪{itemsPrice.toFixed(2)}</strong>
            </div>

            {shippingFee > 0 && (
                <div style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>
                    דמי משלוח: <strong>₪{shippingFee}</strong>
                </div>
            )}

            <div style={{ fontSize: '1.5rem', marginBottom: '2rem' }}>
                סכום לתשלום כולל: <strong>₪{totalPrice.toFixed(2)}</strong>
            </div>
        </>
    );
}
