// src/app/thank-you/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import styles from "./page.module.css";
import {useSearchParams} from "next/navigation";

export default function ThankYouPage() {
    const searchParams = useSearchParams();
    const paymentType = searchParams.get('payment');
    const payboxUrl = 'https://link.payboxapp.com/QbpGp2SCZ4qgABAb6';
    const bitUrl = 'https://www.bitpay.co.il/app/me/5DCEBBEE-5BA3-47C4-AC9C-12B8946182C0';
    const paymentInfo = {
        paybox: <div className={styles.payment + ' payment'}>
            <a href={payboxUrl} target="_blank">לתשלום בפייבוקס</a>
            <br/>
            <br/>
            <div className='bold'>נא לשלוח הודעה <a href="https://wa.me/972542338344" target="_blank">
                <span>בוואטסאפ</span>
            </a> לאחר התשלום </div>
        </div>,
        bit: <div className={styles.payment + ' payment'}>
            <a href={bitUrl} target="_blank">לתשלום בביט</a><br/>
            (במקרה והקישור לתשלום בביט לא עובד - יש לשלוח לאסתר אטלי 0542338344)
            <br/>
            <br/>
            <div className='bold'>נא לשלוח הודעה <a href="https://wa.me/972542338344" target="_blank">
                <span>בוואטסאפ</span>
            </a> לאחר התשלום </div>
        </div>,
        cash: <div className={styles.payment + ' payment'}>
            <div className='bold'>בחרת בתשלום במזומן.</div>
        </div>
    };

    return (
        <div className={styles.page_9 + " container"}>
            <h1 className={styles.page_10}>תודה על הזמנתך!</h1>
            <p className={styles.page_11}>
                ההזמנה התקבלה בהצלחה, ואישור נשלח לכתובת המייל שהגדרת.
            </p>
            {paymentType && paymentInfo[paymentType as keyof typeof paymentInfo] && (
                <p className={styles.page_11}>
                    {paymentInfo[paymentType as keyof typeof paymentInfo]}
                </p>
            )}
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
