import React from 'react';
import styles from "./OrderDateBanner.module.css";
import {getFormattedDateLabel} from "@/app/utils";

export function OrderDateBanner({date}: { date: Date }) {
    return (
        <div className={styles.OrderDateBanner_8}>
            <strong>תאריך ההזמנה:</strong>{' '}
            {getFormattedDateLabel(date)}
        </div>
    );
}
