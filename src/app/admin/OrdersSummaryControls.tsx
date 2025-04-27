// OrdersSummaryControls.tsx
import React from 'react';

interface OrdersSummaryControlsProps {
    fromDate: string;
    toDate: string;
    summaryView: 'all' | 'grouped';
    onFromDateChange: (date: string) => void;
    onToDateChange: (date: string) => void;
    onSummaryViewChange: (view: 'all' | 'grouped') => void;
}

const OrdersSummaryControls = ({ fromDate, toDate, summaryView, onFromDateChange, onToDateChange, onSummaryViewChange }: OrdersSummaryControlsProps) => (
    <div style={{ marginBottom: '1rem' }}>
        <label>
            From:{' '}
            <input type="date" value={fromDate} onChange={(e) => onFromDateChange(e.target.value)} />
        </label>
        <label style={{ marginLeft: '1rem' }}>
            To:{' '}
            <input type="date" value={toDate} onChange={(e) => onToDateChange(e.target.value)} />
        </label>
        <div style={{ marginTop: '1rem' }}>
            <button onClick={() => onSummaryViewChange('all')} style={{ marginRight: '1rem', background: summaryView === 'all' ? '#f59e0b' : '#ddd', padding: '0.5rem 1rem' }}>All Orders</button>
            <button onClick={() => onSummaryViewChange('grouped')} style={{ background: summaryView === 'grouped' ? '#f59e0b' : '#ddd', padding: '0.5rem 1rem' }}>Group by Date</button>
        </div>
    </div>
);

export default OrdersSummaryControls;