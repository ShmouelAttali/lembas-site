export type OrderInfo = {
    id: number;
    customer_name: string;
    phone: string;
    email: string | null;
    fulfillment: string;
    address: string | null;
    notes: string | null;
    order_date: string;
    items_price: number;
    shipping_fee: number;
    total_price: number;
    created_at: string;
    user_id: string | null;
}

export interface ItemInfo {
    id: string;
    title: string;
    price: number;
    quantity: number;
}

export type FulfillmentMethods = 'delivery' | 'pickup' | 'pickup-beruchin';

export type CustomerInfo = {
    name: string;
    phone: string;
    email: string;
    slice: boolean;
    fulfillment: FulfillmentMethods;
    address?: string;
    paymentMethod: PaymentMethod;
    notes: string;
    orderDate: Date;
    user_id: string | null;
}

export interface CustomerInfoUi extends CustomerInfo {
    remember: boolean;
}

export type PaymentMethod = 'paybox' | 'bit' | 'cash';