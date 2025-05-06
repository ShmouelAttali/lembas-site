// src/app/thank-you/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import styles from "./page.module.css";

export default function ThankYouPage() {
    return (
        <div className={styles.page_9 + " container"}>
            <h1 className={styles.page_10}>תודה על הזמנתך!</h1>
            <p className={styles.page_11}>
                ההזמנה התקבלה בהצלחה, ואישור נשלח לכתובת המייל שהגדרת.
            </p>
            <Link href="/" passHref>
                <button
                    className={styles.page_16}
                >
                    חזור לחנות
                </button>
            </Link>
        </div>
    );
}
