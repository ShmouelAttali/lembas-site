// OrdersDetailedTable.tsx
import React from 'react';
import styles from "./OrdersDetailedTable.module.css";

const cell = {
    border: '1px solid #ccc',
    padding: '0.5rem',
    textAlign: 'left' as const,
    whiteSpace: 'nowrap' as const,
};

const OrdersDetailedTable = ({orders}: { orders: any[] }) => (
    <div className={styles.OrdersDetailedTable_12}>
        <table className={styles.OrdersDetailedTable_13}>
            <thead>
            <tr>
                {['ID', 'Date', 'Customer', 'Email', 'Phone', 'Address', 'Fulfillment', 'Shipping ₪', 'Items ₪', 'Total ₪', 'Notes', 'Products'].map((col) => (
                    <th
                        key={col}
                        className={styles.OrdersDetailedTable_19}
                    >
                        {col}
                    </th>
                ))}
            </tr>
            </thead>
            <tbody>
            {orders.map((order) => (
                <tr key={order.id}>
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

export default OrdersDetailedTable;