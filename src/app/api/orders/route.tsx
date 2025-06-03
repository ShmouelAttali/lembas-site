// src/app/api/orders/route.ts
// 'use server';        // ✱ keep Node runtime (don’t mark “edge”)

import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import {supabaseServer} from '@/lib/supabase-server';
import {sendSmsNotification} from "@/app/api/orders/smsSender";
import {sendOrderEmail} from "@/app/api/orders/emailSender";
import {CustomerInfo, ItemInfo} from "@/types/types";
import {orderAlertTemplate} from "@/lib/telegram-templates";
import {sendTelegramWithRetries} from "@/lib/telegram";


export async function POST(req: NextRequest) {
    const body = await req.json();
    const {customer, items, price}: { customer: CustomerInfo, items: ItemInfo[], price: any } = body;
    const supabase = await supabaseServer();
    customer.orderDate = new Date(customer.orderDate);
    /* 1 . Insert order — now requesting the row back */
    const {data: order, error: orderErr} = await supabase
        .from('orders')
        .insert({
            customer_name: customer.name,
            phone: customer.phone,
            email: customer.email,
            fulfillment: customer.fulfillment,
            address: customer.address,
            notes: customer.notes,
            order_date: customer.orderDate.toISOString(),
            items_price: price.itemsPrice,
            shipping_fee: price.shippingFee,
            total_price: price.totalPrice,
            payment_method: customer.paymentMethod,
            user_id: customer.user_id,
            created_at: new Date().toISOString(),
        })
        .select()       // ← ask Postgres to return the new row
        .single();      // ← collapse array → object

    if (orderErr || !order) {
        return NextResponse.json(
            {error: orderErr?.message ?? 'Order insert failed'},
            {status: 500}
        );
    }

    /* 2 . Insert order_items */
    const orderItemsPayload = items.map((i: any) => ({
        order_id: order.id,
        product_id: i.id,
        quantity: i.quantity,
        unit_price: i.price,
        is_sliced: customer.slice,
    }));

    const {error: itemsErr} = await supabase
        .from('order_items')
        .insert(orderItemsPayload);

    if (itemsErr) {
        return NextResponse.json({error: itemsErr.message}, {status: 500});
    }

    if (customer.email && process.env.SEND_EMAIL) {
        /* 3 . Send email — fire-and-forget (don’t block response) */
        sendOrderEmail(customer, order, items);
    }

    /* 4 . Send SMS */
    if (process.env.SEND_SMS) {
        sendSmsNotification(customer, order, items);
    }

    if (process.env.SEND_TELEGRAM) {
        await sendTelegramWithRetries(orderAlertTemplate(customer, order, items));
    }
    /* 5 . Return success */
    return NextResponse.json({success: true, orderId: order.id});
}
