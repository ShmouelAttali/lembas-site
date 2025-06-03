// OrdersGroupedTable.tsx
import React from 'react';
import styles from "./OrdersGroupedTable.module.css";
import {getFormattedDateLabel} from "@/lib/utils"

const cell = {
    border: '1px solid #ccc',
    padding: '0.5rem',
    textAlign: 'left' as const,
    whiteSpace: 'nowrap' as const,
};

const groupByDate = (orders: any[]) => {
    const grouped: Record<string, any[]> = {};
    for (const order of orders) {
        const key = order.order_date?.split('T')[0];
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(order);
    }
    return Object.entries(grouped).sort(([dateA], [dateB]) => {
        return new Date(dateA).getTime() - new Date(dateB).getTime();
    });
};

const groupProducts = (orders: any[]) => {
    const grouped: Record<string, { title: string; quantity: number; sliced: number }> = {};
    for (const order of orders) {
        for (const item of order.order_items || []) {
            const id = item.product_id;
            if (!grouped[id]) {
                grouped[id] = {
                    title: item.products?.title || 'Unknown',
                    quantity: 0,
                    sliced: 0,
                };
            }
            grouped[id].quantity += item.quantity;
            if (item.is_sliced) grouped[id].sliced += item.quantity;
        }
    }
    return Object.values(grouped);
};

const OrdersGroupedTable = ({orders}: { orders: any[] }) => {
    const byDate = groupByDate(orders);
    return (
        <div className={styles.OrdersGroupedTable_44}>
            {byDate.map(([date, orders]) => {
                const d = new Date(date);
                const grouped = groupProducts(orders);
                const totalPrice = orders.reduce((acc, order) => acc + order.total_price, 0);
                return (
                    <div key={date}>
                        <h3 className={styles.OrdersGroupedTable_52}>{getFormattedDateLabel(d)}</h3>
                        <table className={styles.OrdersGroupedTable_53}>
                            <thead>
                            <tr>
                                <th style={cell}>Product</th>
                                <th style={cell}>Total Quantity</th>
                                <th style={cell}>Sliced</th>
                            </tr>
                            </thead>
                            <tbody>
                            {grouped.map((item, i) => (
                                <tr key={i}>
                                    <td style={cell}>{item.title}</td>
                                    <td style={cell}>{item.quantity}</td>
                                    <td style={cell}>{item.sliced}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <h3 className={styles.OrdersGroupedTable_52}>{`מחיר כולל - ${totalPrice} ש"ח. ${grouped.reduce((sum, i) => sum + i.quantity, 0)} לחמים.`}</h3>
                    </div>
                );
            })}
        </div>
    );
};

export default OrdersGroupedTable;