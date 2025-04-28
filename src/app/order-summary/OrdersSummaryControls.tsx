// OrdersSummaryControls.tsx
import React from 'react';
import styles from "./OrdersSummaryControls.module.css";

interface OrdersSummaryControlsProps {
    fromDate: string;
    toDate: string;
    summaryView: 'all' | 'grouped';
    onFromDateChange: (date: string) => void;
    onToDateChange: (date: string) => void;
    onSummaryViewChange: (view: 'all' | 'grouped') => void;
}

const OrdersSummaryControls = ({
                                   fromDate,
                                   toDate,
                                   summaryView,
                                   onFromDateChange,
                                   onToDateChange,
                                   onSummaryViewChange
                               }: OrdersSummaryControlsProps) => (
    <div className={styles.OrdersSummaryControls_14}>
        <label>
            From:{' '}
            <input type="date" value={fromDate} onChange={(e) => onFromDateChange(e.target.value)}/>
        </label>
        <label className={styles.OrdersSummaryControls_19}>
            To:{' '}
            <input type="date" value={toDate} onChange={(e) => onToDateChange(e.target.value)}/>
        </label>
        <div className={styles.OrdersSummaryControls_23}>
            <button onClick={() => onSummaryViewChange('all')}
                    className={styles.OrdersSummaryControls_24 + (summaryView === 'all' ? ' selected' : '')}>All Orders
            </button>
            <button onClick={() => onSummaryViewChange('grouped')} className={styles.OrdersSummaryControls_25 + (summaryView === 'grouped' ? ' selected' : '')}>Group by
                Date
            </button>
        </div>
    </div>
);

export default OrdersSummaryControls;