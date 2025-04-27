'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import {EmptyCartMessage} from "@/components/EmptyCartMessage";

export default function CartPage() {
    const { items, total, clearCart, updateItem, removeItem } = useCart();

    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h1>עגלת הקניות שלי</h1>
            {items.length === 0 ? <EmptyCartMessage /> : (
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
                                    alignItems: 'center',
                                }}
                            >
                                <strong style={{ flex: 2 }}>{item.title}</strong>

                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        flex: 1,
                                    }}
                                >
                                    <button
                                        aria-label="הפחת"
                                        onClick={() =>
                                            updateItem(item.id, item.quantity - 1)
                                        }
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '4px',
                                            border: '1px solid #ccc',
                                            background: 'white',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        −
                                    </button>

                                    <span>{item.quantity}</span>

                                    <button
                                        aria-label="הוסף"
                                        onClick={() =>
                                            updateItem(item.id, item.quantity + 1)
                                        }
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '4px',
                                            border: '1px solid #ccc',
                                            background: 'white',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        +
                                    </button>
                                </div>

                                <span style={{ flex: 1, textAlign: 'right' }}>
                  ₪{(item.price * item.quantity).toFixed(2)}
                </span>

                                <button
                                    aria-label="הסר פריט"
                                    onClick={() => removeItem(item.id)}
                                    style={{
                                        marginInlineStart: '1rem',
                                        background: 'transparent',
                                        border: 'none',
                                        color: 'red',
                                        cursor: 'pointer',
                                    }}
                                >
                                    ×
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* checkout controls */}
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
