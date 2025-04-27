import React from 'react';

const getHebrewDayName = (date: Date) =>
    ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'][date.getDay()];

export function OrderDateBanner({ date }: { date: Date }) {
    return (
        <div style={{ marginBottom: '2rem', fontSize: '1.25rem' }}>
            <strong>תאריך ההזמנה:</strong>{' '}
            {`יום ${getHebrewDayName(date)} ${date.toLocaleDateString('he-IL')}`}
        </div>
    );
}
