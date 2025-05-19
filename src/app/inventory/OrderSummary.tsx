"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./Inventory.module.css";

const todayStr = new Date().toISOString().split("T")[0];

export default function OrderSummary({ onPrepareDeduction }: { onPrepareDeduction: (deductItems: any[]) => void }) {
    const [orders, setOrders] = useState<any[]>([]);
    const [orderDate, setOrderDate] = useState(todayStr);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadOrders();
    }, [orderDate]);

    const loadOrders = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("orders")
            .select("id, order_items(quantity, is_sliced, product_id, products(title))")
            .gte("order_date", `${orderDate}T00:00:00Z`)
            .lt("order_date", `${orderDate}T23:59:59Z`);

        if (error) return console.error("Error loading orders:", error);
        setOrders(data || []);
        setLoading(false);
    };

    const summarizeOrders = () => {
        const summary: Record<string, { title: string; is_sliced: boolean; quantity: number }> = {};
        orders.forEach(order => {
            order.order_items.forEach((item: any) => {
                const key = `${item.product_id}-${item.is_sliced}`;
                if (!summary[key]) {
                    summary[key] = {
                        title: item.products.title,
                        is_sliced: item.is_sliced,
                        quantity: 0,
                    };
                }
                summary[key].quantity += item.quantity;
            });
        });
        return Object.entries(summary).map(([key, value]) => ({ ...value, key }));
    };

    const handlePrepareDeduction = async () => {
        const { data: rows, error } = await supabase.rpc("get_required_ingredients", {
            date_input: orderDate,
        });
        if (error) return console.error("Deduction summary error:", error);
        onPrepareDeduction(rows);
    };

    const grouped = summarizeOrders();

    return (
        <div className={styles.orderSummary}>
            <h2>סיכום הזמנות לפי תאריך</h2>

            <label>
                תאריך הזמנה:
                <input
                    type="date"
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                />
            </label>

            {loading ? (
                <p>טוען הזמנות…</p>
            ) : (
                <>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>מוצר</th>
                            <th>פרוס?</th>
                            <th>כמות</th>
                        </tr>
                        </thead>
                        <tbody>
                        {grouped.map((row) => (
                            <tr key={row.key}>
                                <td>{row.title}</td>
                                <td>{row.is_sliced ? "כן" : "לא"}</td>
                                <td>{row.quantity}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {grouped.length > 0 && (
                        <button onClick={handlePrepareDeduction} className={styles.deductButton}>
                            הסר חומרים מהמצאי
                        </button>
                    )}
                </>
            )}
        </div>
    );
}