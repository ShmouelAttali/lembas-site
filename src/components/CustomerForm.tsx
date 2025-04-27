'use client';

import React from 'react';
import { TextInput } from './form/TextInput';
import { TextArea } from './form/TextArea';
import { RadioGroup } from './form/RadioGroup';
import {CustomerInfoUi, FulfillmentMethods, PaymentMethod} from "@/types/types";

interface Props {
    info: CustomerInfoUi;
    setInfo: React.Dispatch<React.SetStateAction<CustomerInfoUi>>;
    handleChange: (field: keyof CustomerInfoUi) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmit: (e: React.FormEvent) => void;
    submitting: boolean;
}

export function CustomerForm({ info, setInfo, handleChange, handleSubmit, submitting }: Props) {
    var payboxUrl = 'https://link.payboxapp.com/QbpGp2SCZ4qgABAb6';
    var bitUrl = 'https://www.bitpay.co.il/app/me/5DCEBBEE-5BA3-47C4-AC9C-12B8946182C0';
    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
            <TextInput
                label="שם מלא *"
                type="text"
                required
                value={info.name}
                onChange={handleChange('name')}
            />

            <TextInput
                label="טלפון *"
                type="tel"
                required
                value={info.phone}
                onChange={handleChange('phone')}
            />

            <TextInput
                label="אימייל (אופציונלי)"
                type="email"
                value={info.email}
                onChange={handleChange('email')}
            />

            <div style={{ marginBottom: '1rem' }}>
                <label>פרוס?</label><br />
                <label>
                    <input
                        type="checkbox"
                        checked={info.slice}
                        onChange={() => setInfo({ ...info, slice: !info.slice })}
                    />
                    כן
                </label>
            </div>

            <RadioGroup
                label="משלוח או איסוף עצמי?"
                name="fulfillment"
                selected={info.fulfillment}
                onChange={(val) => setInfo({ ...info, fulfillment: val as FulfillmentMethods })}
                options={[
                    { value: 'delivery', label: 'משלוח (10 ש"ח)' },
                    { value: 'pickup', label: 'איסוף עצמי' },
                ]}
            />

            {info.fulfillment === 'delivery' && (
                <TextArea
                    label="כתובת למשלוח *"
                    required
                    value={info.address}
                    onChange={handleChange('address')}
                />
            )}

            <RadioGroup
                label="אופן התשלום"
                name="paymentMethod"
                selected={info.paymentMethod}
                onChange={(val) => setInfo({ ...info, paymentMethod: val as PaymentMethod })}
                options={[
                    { value: 'paybox', label: 'פייבוקס' },
                    { value: 'bit', label: 'ביט' },
                    { value: 'cash', label: 'מזומן' },
                ]}
            />

            <p>
                <a href={payboxUrl} target="_blank">לתשלום בפייבוקס</a>
                <br/>
                <a href={bitUrl} target="_blank">לתשלום בביט</a>
                (במקרה והקישור לתשלום בביט לא עובד- יש לשלוח לאסתר אטלי 0542338344)
            </p>


            <TextArea
                label="הערות נוספות"
                value={info.notes}
                onChange={handleChange('notes')}
            />

            <div style={{ marginBottom: '2rem' }}>
                <label>
                    <input
                        type="checkbox"
                        checked={info.remember}
                        onChange={handleChange('remember')}
                    />
                    זכור את הפרטים לעתיד
                </label>
            </div>

            <button
                type="submit"
                disabled={submitting}
                style={{
                    padding: '0.75rem 1.5rem',
                    background: 'var(--clr-secondary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                }}
            >
                {submitting ? 'שולח…' : 'בצע הזמנה'}
            </button>
        </form>
    );
}
