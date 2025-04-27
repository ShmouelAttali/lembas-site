// src/app/thank-you/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';

export default function ThankYouPage() {
    return (
        <div className="container" style={{ padding: '2rem 0', textAlign: 'center' }}>
            <h1 style={{ marginBottom: '1rem' }}>תודה על הזמנתך!</h1>
            <p style={{ marginBottom: '2rem' }}>
                ההזמנה התקבלה בהצלחה ונשלחה אליך לאימייל.
            </p>
            <Link href="/" passHref>
                <button
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'var(--clr-primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius)',
                        cursor: 'pointer',
                    }}
                >
                    חזור לחנות
                </button>
            </Link>
        </div>
    );
}
