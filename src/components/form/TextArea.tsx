import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
}

export function TextArea({ label, ...props }: TextAreaProps) {
    return (
        <div style={{ marginBottom: '1rem' }}>
            <label>{label}</label>
            <textarea
                {...props}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
        </div>
    );
}
