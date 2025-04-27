import React from 'react';
import styles from "./TextInput.module.css";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export function TextInput({ label, ...props }: TextInputProps) {
    return (
        <div className={styles.TextInput_9}>
            <label>{label}</label>
            <input
                {...props}
                className={styles.TextInput_13}
            />
        </div>
    );
}
