'use client';

import React from 'react';
import {CustomerInfoUi, FulfillmentMethods, PaymentMethod} from "@/types/types";
import styles from "./CustomerForm.module.css";
import {RadioGroup} from "@/components/Forms/RadioGroup";
import { TextArea } from '../Forms/TextArea';
import {TextInput} from "@/components/Forms/TextInput";

interface Props {
    info: CustomerInfoUi;
    setInfoAction: React.Dispatch<React.SetStateAction<CustomerInfoUi>>;
    handleChangeAction: (field: keyof CustomerInfoUi) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleSubmitAction: (e: React.FormEvent) => void;
    submitting: boolean;
    totalPrice: number;
    itemsPrice: number;
    shippingFee: number;
}

export function CustomerForm({
                                 info,
                                 setInfoAction,
                                 handleChangeAction,
                                 handleSubmitAction,
                                 submitting,
                                 totalPrice,
                                 itemsPrice,
                                 shippingFee
                             }: Props) {
    const payboxUrl = 'https://link.payboxapp.com/QbpGp2SCZ4qgABAb6';
    const bitUrl = 'https://www.bitpay.co.il/app/me/5DCEBBEE-5BA3-47C4-AC9C-12B8946182C0';

    return (
        <form onSubmit={handleSubmitAction} className={styles.customerForm}>
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
                inputMode="numeric"
                pattern="[0-9]*"
                value={info.phone}
                onChange={handleChangeAction('phone')}
            />

            <TextInput
                label="אימייל (אופציונלי)"
                type="email"
                required
                value={info.email}
                onChange={handleChangeAction('email')}
            />

            <div className={styles.section + ' radio'}>
                <RadioGroup
                    label="לפרוס?"
                    name="slice"
                    selected={info.slice ? 'slice' : 'whole'}
                    options={[
                        {value: 'slice', label: 'פרוס'},
                        {value: 'whole', label: 'שלם'},
                    ]}
                    onChange={(val) => setInfoAction({...info, slice: val === 'slice'})}
                />
            </div>

            <div className={styles.section + ' radio ' + styles.twoRows}>
                <RadioGroup
                    label="משלוח או איסוף עצמי?"
                    name="fulfillment"
                    selected={info.fulfillment}
                    onChange={(val) => setInfoAction({...info, fulfillment: val as FulfillmentMethods})}
                    options={[
                        {value: 'delivery', label: 'משלוח בכל גוש שילה-עלי (10 ש"ח)'},
                        {value: 'pickup', label: 'איסוף עצמי מהקטורת 48, שילה'},
                    ]}
                />
            </div>

            <TextArea
                label="כתובת למשלוח *"
                required
                disabled={info.fulfillment != 'delivery'}
                value={info.address}
                onChange={handleChangeAction('address')}
            />

            <div className={styles.remember}>
                <label>
                    <input
                        type="checkbox"
                        checked={info.remember}
                        onChange={handleChangeAction('remember')}
                    />
                    זכור את הפרטים שלי
                </label>
            </div>

            <div className={styles.line}></div>

            <div className={styles.summary}>
                <div className={styles.orderSummaryItem}>
                    סה״כ לתשלום פריטים: <strong>₪{itemsPrice.toFixed(2)}</strong>
                </div>

                <div className={styles.shippingFee}>
                    דמי משלוח: <strong>₪{shippingFee}</strong>
                </div>

                <div className={styles.totalPrice}>
                    סה&quot;כ לתשלום: <strong>₪{totalPrice.toFixed(2)}</strong>
                </div>
            </div>

            <div className={styles.section + ' radio'}>
                <RadioGroup
                    label="אופן התשלום"
                    name="paymentMethod"
                    selected={info.paymentMethod}
                    onChange={(val) => setInfoAction({...info, paymentMethod: val as PaymentMethod})}
                    options={[
                        {value: 'paybox', label: 'פייבוקס'},
                        {value: 'bit', label: 'ביט'},
                        {value: 'cash', label: 'מזומן'},
                    ]}
                />
            </div>

            <div className={styles.payment + ' payment'}>
                <a href={payboxUrl} target="_blank">לתשלום בפייבוקס</a>
                <br/>
                <br/>
                <a href={bitUrl} target="_blank">לתשלום בביט</a><br/>
                (במקרה והקישור לתשלום בביט לא עובד - יש לשלוח לאסתר אטלי 0542338344)
            </div>

            <TextArea
                label="הערות נוספות"
                value={info.notes}
                onChange={handleChangeAction('notes')}
            />

            <button
                type="submit"
                disabled={submitting}
                className={styles.submitButton}
            >
                {submitting ? 'שולח…' : 'בצע הזמנה'}
            </button>
        </form>
    );
}
