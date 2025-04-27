'use client';

import React from 'react';
import { TextInput } from './form/TextInput';
import { TextArea } from './form/TextArea';
import { RadioGroup } from './form/RadioGroup';
import {CustomerInfoUi, FulfillmentMethods, PaymentMethod} from "@/types/types";
import styles from "./CustomerForm.module.css";

interface Props {
    info: CustomerInfoUi;
    setInfoAction: React.Dispatch<React.SetStateAction<CustomerInfoUi>>;
    handleChangeAction: (field: keyof CustomerInfoUi) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmitAction: (e: React.FormEvent) => void;
    submitting: boolean;
}

export function CustomerForm({ info, setInfoAction, handleChangeAction, handleSubmitAction, submitting }: Props) {
    var payboxUrl = 'https://link.payboxapp.com/QbpGp2SCZ4qgABAb6';
    var bitUrl = 'https://www.bitpay.co.il/app/me/5DCEBBEE-5BA3-47C4-AC9C-12B8946182C0';
    return (
        <form onSubmit={handleSubmitAction} className={styles.CustomerForm_21}>
            <TextInput
                label="שם מלא *"
                type="text"
                required
                value={info.name}
                onChange={handleChangeAction('name')}
            />

            <TextInput
                label="טלפון *"
                type="tel"
                required
                value={info.phone}
                onChange={handleChangeAction('phone')}
            />

            <TextInput
                label="אימייל (אופציונלי)"
                type="email"
                value={info.email}
                onChange={handleChangeAction('email')}
            />

            <div className={styles.CustomerForm_45}>
                <label>פרוס?</label><br />
                <label>
                    <input
                        type="checkbox"
                        checked={info.slice}
                        onChange={() => setInfoAction({ ...info, slice: !info.slice })}
                    />
                    כן
                </label>
            </div>

            <RadioGroup
                label="משלוח או איסוף עצמי?"
                name="fulfillment"
                selected={info.fulfillment}
                onChange={(val) => setInfoAction({ ...info, fulfillment: val as FulfillmentMethods })}
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
                    onChange={handleChangeAction('address')}
                />
            )}

            <RadioGroup
                label="אופן התשלום"
                name="paymentMethod"
                selected={info.paymentMethod}
                onChange={(val) => setInfoAction({ ...info, paymentMethod: val as PaymentMethod })}
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
                onChange={handleChangeAction('notes')}
            />

            <div className={styles.CustomerForm_103}>
                <label>
                    <input
                        type="checkbox"
                        checked={info.remember}
                        onChange={handleChangeAction('remember')}
                    />
                    זכור את הפרטים לעתיד
                </label>
            </div>

            <button
                type="submit"
                disabled={submitting}
                className={styles.CustomerForm_117}
            >
                {submitting ? 'שולח…' : 'בצע הזמנה'}
            </button>
        </form>
    );
}
