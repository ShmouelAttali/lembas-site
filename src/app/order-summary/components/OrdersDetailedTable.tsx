import React, {useEffect, useState} from 'react';
import styles from "./OrdersDetailedTable.module.css";
import {useSupabaseClient} from "@supabase/auth-helpers-react";

const cell = {
    border: '1px solid #ccc',
    padding: '0.5rem',
    textAlign: 'left' as const,
    whiteSpace: 'nowrap' as const,
};

const OrdersDetailedTable = ({orders}: { orders: any[] }) => {
    const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);
    const [localOrders, setLocalOrders] = useState(orders);
    useEffect(() => {
        setLocalOrders(orders); // update if parent changes
    }, [orders]);
    const supabase = useSupabaseClient();
    const handleToggle = async (orderId: number, field: 'is_payed' | 'is_ready', currentValue: boolean) => {
        setUpdatingOrderId(orderId);
        try {
            const {data, error} = await supabase.from('orders')
                .update({[field]: !currentValue})
                .eq('id', orderId)
                .select('*');
            if (error) throw error;
            setLocalOrders(prev =>
                prev.map(order => {
                        return order.id === orderId ? {
                            ...order,
                            ...data[0]
                        } : order;
                    }
                )
            );
        } catch (err: any) {
            alert(`Error updating order ${orderId}: ${err.message || err}`);
        } finally {
            setUpdatingOrderId(null);
        }
    };

    return (
        <div className={styles.OrdersDetailedTable_12}>
            <table className={styles.OrdersDetailedTable_13}>
                <thead>
                <tr>
                    {[
                        'Paid', 'Ready', 'ID', 'Date', 'Customer', 'Email', 'Phone', 'Address', 'Fulfillment',
                        'Shipping ₪', 'Items ₪', 'Total ₪', 'Paying Method', 'Notes',
                        'Products'
                    ].map((col) => (
                        <th key={col} className={styles.OrdersDetailedTable_19}>
                            {col}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {localOrders.map((order) => (
                    <tr key={order.id}>
                        <td style={cell}>
                            <button
                                onClick={() => handleToggle(order.id, 'is_payed', order.is_payed)}
                                disabled={updatingOrderId === order.id}
                            >
                                {order.is_payed ? '✅' : '❌'}
                            </button>
                        </td>
                        <td style={cell}>
                            <button
                                onClick={() => handleToggle(order.id, 'is_ready', order.is_ready)}
                                disabled={updatingOrderId === order.id}
                            >
                                {order.is_ready ? '✅' : '❌'}
                            </button>
                        </td>
                        <td style={cell}>{order.id}</td>
                        <td style={cell}>{order.order_date?.split('T')[0]}</td>
                        <td style={cell}>{order.customer_name}</td>
                        <td style={cell}>{order.email}</td>
                        <td style={cell}>{order.phone}</td>
                        <td style={cell}>{order.address}</td>
                        <td style={cell}>{order.fulfillment}</td>
                        <td style={cell}>{order.shipping_fee}</td>
                        <td style={cell}>{order.items_price}</td>
                        <td style={cell}>{order.total_price}</td>
                        <td style={cell}>{order.payment_method}</td>
                        <td style={cell}>{order.notes}</td>
                        <td style={cell}>
                            <ul className={styles.OrdersDetailedTable_41}>
                                {(order.order_items || []).map((item: any) => (
                                    <li key={item.id}>
                                        {item.products?.title || 'Product'} ×{item.quantity}
                                        {item.is_sliced ? ' (sliced)' : ''}
                                    </li>
                                ))}
                            </ul>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrdersDetailedTable;
