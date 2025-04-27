import React from 'react';
import styles from "./OrderDateBanner.module.css";

const getHebrewDayName = (date: Date) =>
    ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'][date.getDay()];

export function OrderDateBanner({ date }: { date: Date }) {
    return (
        <div className={styles.OrderDateBanner_8}>
            <strong>תאריך ההזמנה:</strong>{' '}
            {`יום ${getHebrewDayName(date)} ${date.toLocaleDateString('he-IL')}`}
        </div>
    );
}
