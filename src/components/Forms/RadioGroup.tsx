import React from 'react';
import styles from "./RadioGroup.module.css";

interface RadioGroupProps {
    label: string;
    options: { label: string; value: string }[];
    name: string;
    selected: string;
    onChange: (value: string) => void;
}

export function RadioGroup({label, options, name, selected, onChange}: RadioGroupProps) {
    return (
        <div className={styles.RadioGroup_13}>
            <label>{label}</label><br/>
            {options.map(opt => (
                <label key={opt.value} className={styles.RadioGroup_16}>
                    <input
                        type="radio"
                        name={name}
                        value={opt.value}
                        checked={selected === opt.value}
                        onChange={() => onChange(opt.value)}
                    />
                    {opt.label}
                </label>
            ))}
        </div>
    );
}
