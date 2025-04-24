// src/app/cart/page.tsx
'use client'; // because we’re using useCart

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
    const { items, total, clearCart } = useCart();

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h1>עגלת הקניות שלי</h1>
            {items.length === 0 ? (
                <p>העגלה שלך ריקה.</p>
            ) : (
                <>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {items.map((item) => (
                            <li
                                key={item.id}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '1rem',
                                    background: 'white',
                                    padding: '1rem',
                                    borderRadius: 'var(--radius)',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                                }}
                            >
                                <div>
                                    <strong>{item.title}</strong> &times; {item.quantity}
                                </div>
                                <div>₪{(item.price * item.quantity).toFixed(2)}</div>
                            </li>
                        ))}
                    </ul>

                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '2rem',
                        }}
                    >
                        <button
                            onClick={clearCart}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'var(--clr-muted)',
                                color: 'white',
                                border: 'none',
                                borderRadius: 'var(--radius)',
                                cursor: 'pointer',
                            }}
                        >
                            נקה עגלה
                        </button>

                        <div style={{ fontSize: '1.25rem' }}>
                            סה״כ: <strong>₪{total.toFixed(2)}</strong>
                        </div>

                        <Link href="/checkout">
                            <button
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'var(--clr-secondary)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: 'var(--radius)',
                                    cursor: 'pointer',
                                }}
                            >
                                המשך לתשלום
                            </button>
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
