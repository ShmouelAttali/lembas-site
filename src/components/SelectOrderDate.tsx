'use client';

import React, {useEffect, useState} from 'react';
import {getFormattedDateLabel} from "@/lib/utils";
import styles from './SelectOrderDate.module.css';

type Props = {
    dates: Date[];
    handleSelectDateAction: (date: string | null) => void;
};

export default function SelectOrderDate({dates, handleSelectDateAction}: Props) {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [ready, setReady] = useState(false);
    useEffect(() => {
        setReady(true);
    }, [dates]);

    useEffect(() => {
        if (
            selectedDate &&
            !dates.some(d => d.toISOString() === selectedDate)
        ) {
            console.info('removing selected date: ', selectedDate, ' from dates: ', dates.map(d => d.toISOString()).join(','))
            setSelectedDate(null);
            handleSelectDateAction(null);
        }
    }, [dates, selectedDate, handleSelectDateAction]);

    const handleDateClick = (date: string | null) => {
        setSelectedDate(date);
        handleSelectDateAction(date)
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
        </section>
    );
}
