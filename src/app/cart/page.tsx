'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/contexts/CartContext';
import { EmptyCartMessage } from '@/components/EmptyCartMessage';
import styles from './page.module.css';
import {Trash} from "lucide-react";

export default function CartPage() {
    const { items, total, clearCart, updateItem, removeItem } = useCart();

    const [isValidOrderDate, setIsValidOrderDate] = useState(false);

    useEffect(() => {
        const checkDate = async () => {
            const selected = localStorage.getItem('selected_order_date');
            if (!selected) {
                setIsValidOrderDate(false);
                return;
            }

            const { data, error } = await supabase
                .from('order_dates')
                .select('date', { count: 'exact' })
                .eq('date', selected)
                .limit(1);

            if (error) {
                console.error('Error checking order date:', error);
                setIsValidOrderDate(false);
            } else {
                setIsValidOrderDate(data && data.length > 0);
            }
        };

        checkDate();
    }, []);

    return (
        <div className={'container cart'}>
            <h1>עגלת הקניות שלי</h1>

            {items.length === 0 ? (
                <EmptyCartMessage />
            ) : (
                <>
                    <ul className={styles.page_16}>
                        {items.map((item) => (
                            <li key={item.id} className={styles.page_20}>
                                <strong className={styles.page_22}>{item.title}</strong>

                                <div className={styles.page_25}>
                                    <button
                                        aria-label="הפחת"
                                        onClick={() => updateItem(item.id, item.quantity - 1)}
                                        className={styles.page_32}
                                    >
                                        −
                                    </button>

                                    <span>{item.quantity}</span>

                                    <button
                                        aria-label="הוסף"
                                        onClick={() => updateItem(item.id, item.quantity + 1)}
                                        className={styles.page_44}
                                    >
                                        +
                                    </button>
                                </div>

                                <span className={styles.page_50}>
                  ₪{(item.price * item.quantity).toFixed(2)}
                </span>

                                <button
                                    aria-label="הסר פריט"
                                    onClick={() => removeItem(item.id)}
                                    className={styles.page_57}
                                >
                                    <Trash color={"#41780c"} size={20}/>
                                </button>
                            </li>
                        ))}
                    </ul>

                    {/* checkout controls */}
                    <div className={styles.page_67}>
                        <button onClick={clearCart} className={styles.page_71 + ' my-button'}>
                            נקה עגלה
                        </button>

                        <div className={styles.page_76}>
                            סה״כ: <strong>₪{total.toFixed(2)}</strong>
                        </div>

                        {isValidOrderDate ? (
                            <Link href="/checkout">
                                <button className={styles.page_82 + ' my-button'}>
                                    המשך לתשלום
                                </button>
                            </Link>
                        ) : (
                            <div>
                                  לא ניתן להמשיך. נא לחזור ולבחור תאריך הזמנה
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
