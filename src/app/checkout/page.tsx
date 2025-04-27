'use client';

import React, {useEffect, useState} from 'react';
import {useCart} from '@/contexts/CartContext';
import {useRouter} from 'next/navigation';
import {OrderDateBanner} from '@/components/OrderDateBanner';
import {OrderSummary} from '@/components/OrderSummary';
import {CustomerForm} from '@/components/CustomerForm';
import {EmptyCartMessage} from "@/components/EmptyCartMessage";
import {CustomerInfo, CustomerInfoUi} from "@/types/types";
import {useSessionContext} from "@supabase/auth-helpers-react";
import styles from "./page.module.css";

const STORAGE_KEY = 'checkout_info';
export default function CheckoutPage() {
    const {items, total: itemsPrice, clearCart} = useCart();
    const {session} = useSessionContext();
    const router = useRouter();

    const [info, setInfo] = useState<CustomerInfoUi>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(STORAGE_KEY);
            const storedDate = localStorage.getItem('selected_order_date');
            console.log('storedDate', storedDate);

            const base = stored
                ? JSON.parse(stored)
                : {
                    name: '',
                    phone: '',
                    email: '',
                    slice: false,
                    fulfillment: 'delivery',
                    address: '',
                    notes: '',
                    paymentMethod: 'cash',
                    remember: false,
                };

            return {
                ...base,
                orderDate: storedDate
                    ? new Date(storedDate)
                    : null,
            };
        }

        return {
            name: '',
            phone: '',
            email: '',
            slice: false,
            fulfillment: 'delivery',
            address: '',
            notes: '',
            paymentMethod: 'cash',
            remember: false,
            orderDate: null,
        };
    });

    const shippingFee = info.fulfillment === 'delivery' ? 10 : 0;
    const totalPrice = itemsPrice + shippingFee;
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (info.remember) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    }, [info]);

    const handleChange = (field: keyof CustomerInfoUi) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const value =
            e.target.type === 'checkbox'
                ? (e.target as HTMLInputElement).checked
                : e.target.value;
        setInfo({...info, [field]: value});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!info.orderDate) {
            alert('יש לבחור תאריך הזמנה לפני השלמת ההזמנה.');
            return;
        }

        setSubmitting(true);
        const customer: CustomerInfo = {
            name: info.name,
            phone: info.phone,
            email: info.email,
            slice: info.slice,
            fulfillment: info.fulfillment,
            paymentMethod: info.paymentMethod,
            address: info.address,
            notes: info.notes,
            orderDate: info.orderDate,
            user_id: session?.user.id ?? null
        }

        const payload = {
            customer,
            items,
            price: {itemsPrice, shippingFee, totalPrice},
        };

        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            clearCart();
            router.push('/thank-you');
        } else {
            console.error(await res.text());
            setSubmitting(false);
            alert('שגיאה ביצירת ההזמנה, נסה שוב.');
        }
    };

    if (items.length === 0) return <EmptyCartMessage/>;

    return (
        <div className={styles.page_130 + " container"}>
            <h1>תשלום</h1>

            {info.orderDate && <OrderDateBanner date={info.orderDate}/>}

            <OrderSummary
                items={items}
                itemsPrice={itemsPrice}
                shippingFee={shippingFee}
                totalPrice={totalPrice}
            />

            <CustomerForm
                info={info}
                setInfoAction={setInfo}
                handleChangeAction={handleChange}
                handleSubmitAction={handleSubmit}
                submitting={submitting}
            />
        </div>
    );
}
