'use client';

import React, {useEffect, useState} from 'react';
import {getFormattedDateLabel} from "@/lib/utils";
import styles from './SelectOrderDate.module.css';

type Props = {
    dates: Date[];
};

export default function SelectOrderDate({dates}: Props) {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const savedDate = localStorage.getItem('selected_order_date');
        if (savedDate && dates.find((d) => d.toISOString() === savedDate)) {
            setSelectedDate(savedDate);
        } else {
            localStorage.removeItem('selected_order_date');
        }
        setReady(true);
    }, [dates]);

    const handleDateClick = (date: string) => {
        setSelectedDate(date);
        localStorage.setItem('selected_order_date', date);
    };

    return (
        <section className={styles.booking}>
            <h2 className={styles.bookingTitle}>
                {selectedDate ? 'תאריך איסוף ההזמנה:' : 'בחר תאריך לאיסוף ההזמנה:'}
            </h2>
            <div className={styles.dates}>
                {dates.map((d) => (
                    <button
                        key={d.toISOString()}
                        className={`${styles.dateBtn} ${(ready && selectedDate === d.toISOString()) ? styles.dateBtnSelected : ''}`}
                        onClick={() => handleDateClick(d.toISOString())}
                    >
                        {getFormattedDateLabel(d)}
                    </button>
                ))}
            </div>
            <div className={styles.info}>אספקה החל מהשעה 14:00. לאיסוף מוקדם יותר - ניתן לציין בהערות.</div>

        </section>
    );
}
