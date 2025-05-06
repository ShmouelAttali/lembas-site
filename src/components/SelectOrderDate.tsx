'use client';

import React, {useState, useEffect} from 'react';
import {getFormattedDateLabel} from "@/app/utils";

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
        setReady(true); // Only mark ready after we've processed localStorage
    }, [dates]);

    const handleDateClick = (date: string) => {
        setSelectedDate(date);
        localStorage.setItem('selected_order_date', date);
    };

    return (
        <div className="dates">
            {dates.map((d) => (
                <button
                    key={d.toISOString()}
                    className={`date-btn ${(ready && selectedDate === d.toISOString()) ? 'selected' : ''}`}
                    onClick={() => handleDateClick(d.toISOString())}
                >
                    {getFormattedDateLabel(d)}
                </button>
            ))}
        </div>
    );
}
