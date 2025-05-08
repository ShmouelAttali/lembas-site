'use client';

import { useSessionContext } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import UserOrdersClient from './UserOrdersClient';
import styles from "./UserOrdersClient.module.css";

export default function UserOrdersPage() {
    const { session, supabaseClient } = useSessionContext();
    const user = session?.user;

    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            if (!user) return;

            const { data, error } = await supabaseClient
                .from('orders')
                .select('*, order_items(*, products(title))')
                .eq('user_id', user.id);

            if (error) {
                console.error('Error fetching orders:', error);
            } else {
                setOrders(data || []);
            }
            setLoading(false);
        }

        fetchOrders();
    }, [user, supabaseClient]);

    if (!session) {
        return <p>אנא התחבר כדי לראות את ההזמנות שלך.</p>;
    }

    if (loading) {
        return <p>טוען הזמנות...</p>;
    }

    return (
        <div className={styles.userOrdersPage}>
            <h1>שם המשתמש - {user?.user_metadata?.full_name ?? user?.email}</h1>
            <h2>ההזמנות שלך:</h2>
            <UserOrdersClient orders={orders} />
        </div>
    );
}
