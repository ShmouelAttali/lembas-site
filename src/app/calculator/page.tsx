'use client';
import React, {useEffect, useState} from 'react';
import styles from './CalculatorPage.module.css';

type SectionVals = { water: number; flour: number; starter: number };

const calculateSectionValues = (curQuantity: number, starterRatio: number, waterRatio: number, flourRatio: number): SectionVals => {
    const totalRatio = 1 + 1 + starterRatio;
    if (!totalRatio) return {water: 0, flour: 0, starter: 0};
    return {
        water: (curQuantity * waterRatio) / totalRatio,
        flour: (curQuantity * flourRatio) / totalRatio,
        starter: (curQuantity * starterRatio) / totalRatio,
    };
};

export default function CalculatorPage() {
    const waterRatio = 1.2;
    const flourRatio = 1;
    const [quantity, setQuantity] = useState(0);
    const [feedCount, setFeedCount] = useState(2);
    const [feedHours, setFeedHours] = useState<{ [key: number]: number }>({
        1: 12,
        2: 3,
    });
    const [sectionValues, setSectionValues] = useState<{ [sec: number]: SectionVals }>({});

    const starterRatios: { [key: number]: number } = {
        3: 1,
        7: 0.2,
        12: 0.05,
        15: 0.01,
    };


    useEffect(() => {
        const next: { [k: number]: SectionVals } = {};
        for (let sec = feedCount; sec >= 1; sec--) {
            const hours = feedHours[sec] ?? 0;
            const curQty = sec === feedCount
                ? quantity
                : next[sec + 1].starter;
            next[sec] = calculateSectionValues(curQty, starterRatios[hours], waterRatio, flourRatio);
        }
        setSectionValues(next);
    }, [feedCount, feedHours, quantity]);

    return (
        <div className={styles.container}>
            <div className={styles.inputGroup}>
                <label>כמות מחמצת רצויה:</label>
                <input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(+e.target.value)}
                />
                גרם
            </div>

            <div className={styles.inputGroup}>
                <label>כמות האכלות:</label>
                <select
                    value={feedCount}
                    onChange={e => {
                        const n = +e.target.value;
                        setFeedCount(n);
                        setFeedHours(h => ({...h, [n]: h[n] ?? 12}));
                    }}
                >
                    {[1, 2].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
            </div>

            {Array.from({length: feedCount}, (_, i) => i + 1).map(sec => {
                const vals = sectionValues[sec] ?? {water: 0, flour: 0, starter: 0};
                return (
                    <div key={sec} className={styles.section}>
                        <h3>האכלה {sec}</h3>

                        <div className={styles.inputGroup}>
                            <label>כמות שעות להאכלה:</label>
                            <select
                                value={feedHours[sec]}
                                onChange={e =>
                                    setFeedHours(h => ({...h, [sec]: +e.target.value}))
                                }
                            >
                                {[3, 7, 12, 15].map(h =>
                                    <option key={h} value={h}>{h}</option>
                                )}
                            </select>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>מים:</label>
                            <input readOnly value={vals.water.toFixed(2)}/>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>קמח:</label>
                            <input readOnly value={vals.flour.toFixed(2)}/>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>מחמצת:</label>
                            <input readOnly value={vals.starter.toFixed(2)}/>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
