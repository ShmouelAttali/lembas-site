// src/app/api/orders/route.ts
// 'use server';        // ✱ keep Node runtime (don’t mark “edge”)

import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import {supabaseServer} from '@/lib/supabase-server';
import {supabaseAdmin} from '@/lib/supabase-admin';
import {sendSmsNotification} from "@/app/api/orders/smsSender";
import {sendOrderEmail} from "@/app/api/orders/emailSender";
import {CustomerInfo, ItemInfo} from "@/types/types";
import {orderAlertTemplate} from "@/lib/telegram-templates";
import {sendTelegramWithRetries} from "@/lib/telegram";


const FULFILLMENTS = ['delivery', 'pickup', 'pickup-beruchin'];
const PAYMENT_METHODS = ['paybox', 'bit', 'cash'];

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => null);
    const customer: CustomerInfo | undefined = body?.customer;
    const rawItems: ItemInfo[] | undefined = body?.items;

    /* 0 . Validate input (guest checkout stays open, but the data is checked) */
    const str = (v: unknown, max: number) => typeof v === 'string' && v.trim().length > 0 && v.length <= max;
    if (
        !customer || !Array.isArray(rawItems) || rawItems.length === 0 || rawItems.length > 100 ||
        !str(customer.name, 200) || !str(customer.phone, 50) ||
        (customer.email && (typeof customer.email !== 'string' || customer.email.length > 200 || !/^[^@\s]+@[^@\s]+$/.test(customer.email))) ||
        (customer.address && (typeof customer.address !== 'string' || customer.address.length > 300)) ||
        (customer.notes && (typeof customer.notes !== 'string' || customer.notes.length > 1000)) ||
        !FULFILLMENTS.includes(customer.fulfillment) ||
        !PAYMENT_METHODS.includes(customer.paymentMethod) ||
        Number.isNaN(new Date(customer.orderDate).getTime()) ||
        rawItems.some(i => !i || typeof i.id !== 'string' || !Number.isInteger(i.quantity) || i.quantity < 1 || i.quantity > 100)
    ) {
        return NextResponse.json({error: 'Invalid order'}, {status: 400});
    }

    /* Who is ordering comes from the session, not from the request body */
    const supabase = await supabaseServer();
    const {data: {user}} = await supabase.auth.getUser();
    customer.user_id = user?.id ?? null;
    customer.orderDate = new Date(customer.orderDate);

    /* Prices come from the database, not from the browser */
    const db = supabaseAdmin();
    const {data: products, error: prodErr} = await db
        .from('products')
        .select('id, price')
        .in('id', rawItems.map(i => i.id));
    if (prodErr || !products || products.length !== new Set(rawItems.map(i => i.id)).size) {
        return NextResponse.json({error: 'Unknown product'}, {status: 400});
    }
    /* Each order sends SMS/email/Telegram, so cap how often one phone or email can order */
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const countRecent = async (column: 'phone' | 'email', value: string) => {
        const {count} = await db
            .from('orders')
            .select('id', {count: 'exact', head: true})
            .eq(column, value)
            .gte('created_at', since);
        return count ?? 0;
    };
    const recent = Math.max(
        await countRecent('phone', customer.phone),
        customer.email ? await countRecent('email', customer.email) : 0,
    );
    if (recent >= 5) {
        return NextResponse.json({error: 'Too many orders, try again later'}, {status: 429});
    }

    const priceById = new Map(products.map(p => [String(p.id), Number(p.price)]));
    const items: ItemInfo[] = rawItems.map(i => ({...i, price: priceById.get(i.id)!}));
    const itemsPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingFee = customer.fulfillment === 'delivery' ? 10 : 0;
    const price = {itemsPrice, shippingFee, totalPrice: itemsPrice + shippingFee};

    /* 1 . Insert order — now requesting the row back */
    const {data: order, error: orderErr} = await db
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

    const {error: itemsErr} = await db
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
