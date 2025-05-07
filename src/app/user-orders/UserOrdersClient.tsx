'use client';

import styles from './UserOrdersClient.module.css';

interface Product {
    title: string;
}

interface OrderItem {
    id: string;
    product_id: string;
    quantity: number;
    is_sliced: boolean;
    products: Product;
}

interface Order {
    id: number;
    order_date: string;
    order_items: OrderItem[];
    fulfillment: string;
    total_price: number;
}

interface UserOrdersClientProps {
    orders: Order[];
}

export default function UserOrdersClient({ orders }: UserOrdersClientProps) {
    if (!orders.length) {
        return <p className={styles.EmptyState}>אין הזמנות להצגה.</p>;
    }

    return (
        <div className={styles.TableWrapper}>
            <table className={styles.Table}>
                <thead>
                <tr>
                    <th>תאריך</th>
                    <th>הלחמים</th>
                    <th>משלוח / איסוף</th>
                    <th>סך עלות</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <tr key={order.id}>
                        <td>{new Date(order.order_date).toLocaleDateString('he-IL')}</td>
                        <td>
                            <ul className={styles.BreadList}>
                                {(order.order_items || []).map((item) => (
                                    <li key={item.id}>
                                        {item.products?.title || 'מוצר'} ×{item.quantity}
                                        {item.is_sliced ? ' (פרוס)' : ''}
                                    </li>
                                ))}
                            </ul>
                        </td>
                        <td>
                            {order.fulfillment === 'delivery' ? 'משלוח' : 'איסוף עצמי'}
                        </td>
                        <td>{order.total_price} ₪</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
