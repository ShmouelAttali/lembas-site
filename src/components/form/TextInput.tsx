import React from 'react';

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export function TextInput({ label, ...props }: TextInputProps) {
    return (
        <div style={{ marginBottom: '1rem' }}>
            <label>{label}</label>
            <input
                {...props}
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
            />
        </div>
    );
}
