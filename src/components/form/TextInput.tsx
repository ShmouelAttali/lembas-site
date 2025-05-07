import React from 'react';
import styles from "./TextInput.module.css";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export function TextInput({ label, type = 'text', inputMode, pattern, ...props }: TextInputProps) {
    // if it's a tel field, default to numeric-only keypad/pattern
    const computedInputMode = inputMode ?? (type === 'tel' ? 'numeric' : undefined);
    const computedPattern   = pattern   ?? (type === 'tel' ? '[0-9]*'  : undefined);

    return (
        <div className={styles.TextInput_9}>
            <label>{label}</label>
            <input
                type={type}
                {...props}
                inputMode={computedInputMode}
                pattern={computedPattern}
                className={styles.TextInput_13}
            />
        </div>
    );
}
