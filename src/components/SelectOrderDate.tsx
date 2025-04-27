'use client';

import React, { useState, useEffect } from 'react';

type Props = {
    dates: { label: string; date: Date }[];
};

export default function SelectOrderDate({ dates }: Props) {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Load the initially selected date from localStorage
    useEffect(() => {
        const savedDate = localStorage.getItem('selected_order_date');
        if (savedDate) {
            setSelectedDate(savedDate);
        }
    }, []);

    const handleDateClick = (date: string) => {
        setSelectedDate(date); // Update selected date in state
console.log(date);
        localStorage.setItem('selected_order_date', date); // Store it in localStorage
    };

    return (
        <div className="dates">
            {dates.map((d) => (
                <button
                    key={d.label}
                    className={`date-btn ${selectedDate === d.date.toISOString() ? 'selected' : ''}`}
                    onClick={() => handleDateClick(d.date.toISOString())}
                >
                    {d.label}
                </button>
            ))}
        </div>
    );
}