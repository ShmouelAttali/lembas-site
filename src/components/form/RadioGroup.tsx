import React from 'react';

interface RadioGroupProps {
    label: string;
    options: { label: string; value: string }[];
    name: string;
    selected: string;
    onChange: (value: string) => void;
}

export function RadioGroup({ label, options, name, selected, onChange }: RadioGroupProps) {
    return (
        <div style={{ marginBottom: '1rem' }}>
            <label>{label}</label><br />
            {options.map(opt => (
                <label key={opt.value} style={{ marginInlineEnd: '1rem', direction: 'rtl' }}>
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
