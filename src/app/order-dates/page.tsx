'use client'
import React, {useEffect, useState} from 'react'
import {supabase} from '@/lib/supabase'
import {HDate} from '@hebcal/core'
import styles from './OrderDatesPage.module.css'

export default function OrderDatesPage() {
    function formatLocalDate(d: Date) {
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${y}-${m}-${day}`
    }

    const [month, setMonth] = useState(() => {
        const now = new Date()
        const mm = String(now.getMonth() + 1).padStart(2, '0')
        return `${now.getFullYear()}-${mm}`
    })
    const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set())

    useEffect(() => {
        const loadDates = async () => {
            const [year, mon] = month.split('-')
            const from = `${year}-${mon}-01`
            const lastDay = new Date(+year, +mon, 0).getDate()
            const to = `${year}-${mon}-${String(lastDay).padStart(2, '0')}`

            const {data, error} = await supabase
                .from('order_dates')
                .select('date')
                .gte('date', from)
                .lte('date', to)

            if (error) {
                console.error('Error loading order_dates:', error)
                return
            }
            setSelectedDates(new Set(data.map((row) => row.date)))
        }
        loadDates()
    }, [month])


    const handleDayClick = async (date: Date) => {
        const iso = formatLocalDate(date);
        const isSel = selectedDates.has(iso)

        if (isSel) {
            setSelectedDates((prev) => {
                const next = new Set(prev)
                next.delete(iso)
                return next
            })
            const {error} = await supabase
                .from('order_dates')
                .delete()
                .eq('date', iso)
            if (error) {
                setSelectedDates((prev) => new Set(prev).add(iso))
                alert('Failed to unmark date—please try again.')
            }
        } else {
            setSelectedDates((prev) => new Set(prev).add(iso))
            const {error} = await supabase
                .from('order_dates')
                .insert({date: iso})
            if (error) {
                setSelectedDates((prev) => {
                    const next = new Set(prev)
                    next.delete(iso)
                    return next
                })
                alert('Failed to mark date—please try again.')
            }
        }
    }

    const renderCalendar = () => {
        const [year, mon] = month.split('-').map(Number)
        const firstWeekday = new Date(year, mon - 1, 1).getDay()
        const daysInMonth = new Date(year, mon, 0).getDate()

        const cells: (Date | null)[] = []
        for (let i = 0; i < firstWeekday; i++) cells.push(null)
        for (let d = 1; d <= daysInMonth; d++) {
            cells.push(new Date(year, mon - 1, d))
        }

        return cells.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`}/>

            const iso = formatLocalDate(day)
            const isSel = selectedDates.has(iso)
            const hebrewDate = new HDate(day)
            const [dayMon] = hebrewDate.renderGematriya(true).split(' תשפ');
            return (
                <div
                    key={iso}
                    onClick={() => handleDayClick(day)}
                    className={`${styles.dayCell} ${isSel ? styles.dayCellSelected : ''}`}
                >
                    <div className={styles.dayNumber}>{day.getDate()}</div>
                    <div className={styles.hebrewNumber}>{dayMon}</div>
                </div>
            )
        })
    }

    return (
        <div className={styles.container}>
            <label htmlFor="monthPicker" className={styles.monthPickerLabel}>
                Select month:
            </label>
            <input
                id="monthPicker"
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className={styles.monthPicker}
            />

            <div className={styles.calendar}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((wd) => (
                    <div key={wd} className={styles.weekday}>
                        {wd}
                    </div>
                ))}
                {renderCalendar()}
            </div>
        </div>
    )
}
