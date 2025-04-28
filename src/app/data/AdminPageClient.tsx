'use client';

import React, {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {supabase} from '@/lib/supabase';
import TabButtons from './TabButtons';

import {TABS} from './constants';
import styles from "./AdminPageClient.module.css";
import {Column, CrudTable} from "@/components/CrudTable";

const productColumns: Column<any>[] = [
    {key: 'title', label: 'Title', editable: true},
    {key: 'price', label: 'Price', editable: true},
    {key: 'description', label: 'Description', editable: true},
    {key: 'slug', label: 'Slug', editable: true},
    {key: 'weight', label: 'Weight', editable: true},
    {
        key: 'image_url',
        label: 'Image',
        render: (url) => {
            if (url) {
                const {data: {publicUrl}} = supabase.storage
                    .from('product-images')
                    .getPublicUrl(url + '.jpg');
                return <img src={publicUrl} width={50}/>
            } else {
                return 'No image';

            }
            ;
        },
    },
];
const genericColumns: Record<string, Column<any>[]> = {
    orders: [
        {key: 'id', label: 'ID'},
        {key: 'customer_name', label: 'Customer', editable: true},
        // …add more fields you care about
    ],
    name_suffixes: [
        {key: 'id', label: 'ID'},
        {key: 'suffix', label: 'Suffix', editable: true},
    ],
    // add entries for all your other non‐products tables
};

export default function AdminPageClient({initialData, activeTab}: { initialData: any, activeTab: string }) {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const currentTab = searchParams.get('tab') ?? activeTab;

    const handleTabChange = async (tab: string) => {
        if (tab === currentTab) return;
        router.replace(`/data?tab=${tab}`, {scroll: false});
        await loadData(tab);
    };

    const loadData = async (tab = currentTab) => {
        setLoading(true);
        setError(null);

        try {
            const {data: rows, error} = await supabase.from(tab).select('*');
            if (error) throw error;
            setData(rows || []);
        } catch (err: any) {
            setError(err.message);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.AdminPageClient_69}>
            <TabButtons tabs={TABS} currentTab={currentTab} onTabChange={handleTabChange}/>

            {loading ? (
                <p>Loading…</p>
            ) : error ? (
                <p className={styles.AdminPageClient_86}>Error: {error}</p>
            ) : !data || data.length === 0 ? (
                <p>No rows in <strong>{currentTab}</strong></p>
            ) : currentTab === 'products' ? (
                // ← Products: CRUD + image upload/delete
                <CrudTable
                    table="products"
                    columns={productColumns}
                    uniqueKey="id"
                    bucket="product-images"
                    imageColumns={{pathKey: 'image_path', urlKey: 'image_url'}}
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
