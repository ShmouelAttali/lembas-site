import React from 'react';
import styles from "./TextArea.module.css";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
}

export function TextArea({ label, ...props }: TextAreaProps) {
    return (
        <div className={styles.TextArea_9}>
            <label>{label}</label>
            <textarea
                {...props}
                className={styles.TextArea_13}
            />
        </div>
    );
}
