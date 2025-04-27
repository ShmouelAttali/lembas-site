'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import TabButtons from './TabButtons';
import OrdersSummaryControls from './OrdersSummaryControls';
import OrdersDetailedTable from './OrdersDetailedTable';
import OrdersGroupedTable from './OrdersGroupedTable';

import { TABS } from './constants';

export default function AdminPageClient({ initialData, activeTab }) {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [fromDate, setFromDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [toDate, setToDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() + 2);
        return date.toISOString().split('T')[0];
    });
    const [summaryView, setSummaryView] = useState<'all' | 'grouped'>('all');

    const router = useRouter();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get('tab') ?? activeTab;

    const handleTabChange = async (tab: string) => {
        if (tab === currentTab) return;
        router.replace(`/admin?tab=${tab}`, { scroll: false });
        await loadData(tab);
    };

    const loadData = async (tab = currentTab) => {
        setLoading(true);
        setError(null);

        try {
            if (tab === 'orders_summary') {
                const { data: orders, error } = await supabase
                    .from('orders')
                    .select('*, order_items(*, products(title))')
                    .gte('order_date', fromDate)
                    .lte('order_date', toDate);
                if (error) throw error;
                setData(orders || []);
            } else {
                const { data: rows, error } = await supabase.from(tab).select('*');
                if (error) throw error;
                setData(rows || []);
            }
        } catch (err: any) {
            setError(err.message);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentTab === 'orders_summary') {
            loadData();
        }
    }, [fromDate, toDate, summaryView]);

    return (
        <div style={{ padding: '1rem' }}>
            <TabButtons tabs={TABS} currentTab={currentTab} onTabChange={handleTabChange} />

            {currentTab === 'orders_summary' && (
                <OrdersSummaryControls
                    fromDate={fromDate}
                    toDate={toDate}
                    summaryView={summaryView}
                    onFromDateChange={setFromDate}
                    onToDateChange={setToDate}
                    onSummaryViewChange={setSummaryView}
                />
            )}

            {loading ? (
                <p>Loading…</p>
            ) : error ? (
                <p style={{ color: 'red' }}>Error: {error}</p>
            ) : !data || data.length === 0 ? (
                <p>No rows in <strong>{currentTab}</strong></p>
            ) : currentTab === 'orders_summary' && summaryView === 'grouped' ? (
                <OrdersGroupedTable orders={data} />
            ) : currentTab === 'orders_summary' ? (
                <OrdersDetailedTable orders={data} />
            ) : (
                <pre>{JSON.stringify(data, null, 2)}</pre>
            )}
        </div>
    );
}
