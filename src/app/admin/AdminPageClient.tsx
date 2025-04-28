'use client';

import React, {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {supabase} from '@/lib/supabase';
import TabButtons from './TabButtons';
import OrdersSummaryControls from './OrdersSummaryControls';
import OrdersDetailedTable from './OrdersDetailedTable';
import OrdersGroupedTable from './OrdersGroupedTable';

import {TABS} from './constants';
import styles from "./AdminPageClient.module.css";
import {Column, CrudTable} from "@/components/CrudTable";

const productColumns: Column<any>[] = [
    { key: 'title', label: 'Title', editable: true },
    { key: 'price', label: 'Price', editable: true },
    { key: 'description', label: 'Description', editable: true },
    { key: 'slug', label: 'Slug', editable: true },
    { key: 'weight', label: 'Weight', editable: true },
    {
        key: 'image_url',
        label: 'Image',
        render: (url) => {
            if (url){
                const {data: {publicUrl}} = supabase.storage
                    .from('product-images')
                    .getPublicUrl(url + '.jpg');
                return <img src={publicUrl} width={50} />
            }
            else{
                return 'No image';

            } ;
        },
    },
];
const genericColumns: Record<string, Column<any>[]> = {
    orders: [
        { key: 'id', label: 'ID' },
        { key: 'customer_name', label: 'Customer', editable: true },
        // …add more fields you care about
    ],
    name_suffixes: [
        { key: 'id', label: 'ID' },
        { key: 'suffix', label: 'Suffix', editable: true },
    ],
    // add entries for all your other non‐products tables
};

export default function AdminPageClient({initialData, activeTab}: { initialData: any, activeTab: string }) {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [fromDate, setFromDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [toDate, setToDate] = useState(() => {
        const date = new Date();
        date.setDate(date.getDate() + 14);
        return date.toISOString().split('T')[0];
    });
    const [summaryView, setSummaryView] = useState<'all' | 'grouped'>('all');

    const router = useRouter();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get('tab') ?? activeTab;

    const handleTabChange = async (tab: string) => {
        if (tab === currentTab) return;
        router.replace(`/admin?tab=${tab}`, {scroll: false});
        await loadData(tab);
    };

    const loadData = async (tab = currentTab) => {
        setLoading(true);
        setError(null);

        try {
            if (tab === 'orders_summary') {
                const {data: orders, error} = await supabase
                    .from('orders')
                    .select('*, order_items(*, products(title))')
                    .gte('order_date', fromDate)
                    .lte('order_date', toDate);
                if (error) throw error;
                setData(orders || []);
            } else {
                const {data: rows, error} = await supabase.from(tab).select('*');
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
        <div className={styles.AdminPageClient_69}>
            <TabButtons tabs={TABS} currentTab={currentTab} onTabChange={handleTabChange}/>

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
                <p className={styles.AdminPageClient_86}>Error: {error}</p>
            ) : !data || data.length === 0 ? (
                <p>No rows in <strong>{currentTab}</strong></p>
            ) : currentTab === 'orders_summary' && summaryView === 'grouped' ? (
                <OrdersGroupedTable orders={data}/>
            ) : currentTab === 'orders_summary' ? (
                <OrdersDetailedTable orders={data}/>
            ) : currentTab === 'products' ? (
                // ← Products: CRUD + image upload/delete
                <CrudTable
                    table="products"
                    columns={productColumns}
                    uniqueKey="id"
                    bucket="product-images"
                    imageColumns={{ pathKey: 'image_path', urlKey: 'image_url' }}
                />

            ) : (
                // ← Generic CRUD for any other table
                <CrudTable
                    table={currentTab}
                    columns={genericColumns[currentTab] || []}
                    uniqueKey="id"
                />
            )}
        </div>
    );
}
