'use client';

import React, {useState, useEffect} from 'react';
import {getFormattedDateLabel} from "@/app/utils";

type Props = {
    dates: Date[];
};

export default function SelectOrderDate({dates}: Props) {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    // Load the initially selected date from localStorage
    useEffect(() => {
        const savedDate = localStorage.getItem('selected_order_date');
        if (savedDate) {
            if (!dates.find((d) => d.toISOString() === savedDate)) {

                localStorage.removeItem('selected_order_date');
            } else {
                setSelectedDate(savedDate);
            }
        }
    }, []);

    const handleDateClick = (date: string) => {
        setSelectedDate(date); // Update selected date in state
        localStorage.setItem('selected_order_date', date); // Store it in localStorage
    };

    return (
        <div className="dates">
            {dates.map((d) => (
                <button
                    key={d.toISOString()}
                    className={`date-btn ${selectedDate === d.toISOString() ? 'selected' : ''}`}
                    onClick={() => handleDateClick(d.toISOString())}
                >
                    {getFormattedDateLabel(d)}
                </button>
            ))}
        </div>
    );
}