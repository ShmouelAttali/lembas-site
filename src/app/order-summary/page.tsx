'use client';
import React, {useEffect, useState} from "react";
import styles from "@/app/data/AdminPageClient.module.css";
import OrdersSummaryControls from "@/app/data/OrdersSummaryControls";
import OrdersGroupedTable from "@/app/data/OrdersGroupedTable";
import OrdersDetailedTable from "@/app/data/OrdersDetailedTable";
import {supabase} from "@/lib/supabase";
import {OrderInfo} from "@/types/types";


export default function OrderSummaryPage() {
    const [fromDate, setFromDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [toDate, setToDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() + 14);
        return date.toISOString().split('T')[0];
    });

    const [data, setData] = useState([] as OrderInfo[]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [summaryView, setSummaryView] = useState<'all' | 'grouped'>('all');

    const loadData = async () => {
        setLoading(true);
        setError(null);

        try {
            const {data: orders, error} = await supabase
                .from('orders')
                .select('*, order_items(*, products(title))')
                .gte('order_date', fromDate)
                .lte('order_date', toDate);
            if (error) throw error;
            setData(orders || []);
        } catch (err: any) {
            setError(err.message);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [fromDate, toDate, summaryView]);

    return (
        <div className={styles.AdminPageClient_69}>
            <OrdersSummaryControls
                fromDate={fromDate}
                toDate={toDate}
                summaryView={summaryView}
                onFromDateChange={setFromDate}
                onToDateChange={setToDate}
                onSummaryViewChange={setSummaryView}
            />

            {loading ? (
                <p>Loading…</p>
            ) : error ? (
                <p className={styles.AdminPageClient_86}>Error: {error}</p>
            ) : !data || data.length === 0 ? (
                <p>No rows in order summary</p>
            ) : summaryView === 'grouped' ? (
                <OrdersGroupedTable orders={data}/>
            ) : (
                <OrdersDetailedTable orders={data}/>
            )
            }
        </div>
    );
}
