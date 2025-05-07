'use client'
import {useCart} from "@/contexts/CartContext";
import {useSessionContext} from "@supabase/auth-helpers-react";
import {useRouter} from "next/navigation";
import React, {useEffect, useState} from "react";
import {CustomerInfo, CustomerInfoUi} from "@/types/types";
import {EmptyCartMessage} from "@/components/EmptyCartMessage";
import SelectOrderDate from "@/components/SelectOrderDate";
import {OrderSummary} from "@/components/OrderSummary";
import {CustomerForm} from "@/components/CustomerForm";

const STORAGE_KEY = 'checkout_info';
export default function CheckoutPageClient({dates}: { dates: Date[] }) {
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
            alert('שגיאה ביצירת ההזמנה, אנא נסה שוב.');
        }
    };

    if (items.length === 0) return <EmptyCartMessage/>;

    return (
        <div className={" container orderSummary"}>
            <h1>תשלום</h1>

            <SelectOrderDate dates={dates}/>


            <h2>פריטים לתשלום:</h2>
            <OrderSummary
                items={items}
                itemsPrice={itemsPrice}
            />

            <CustomerForm
                info={info}
                setInfoAction={setInfo}
                handleChangeAction={handleChange}
                handleSubmitAction={handleSubmit}
                submitting={submitting}
                totalPrice={totalPrice}
                itemsPrice={itemsPrice}
                shippingFee={shippingFee}
            />
        </div>
    );
}
