// src/app/admin/AdminPageClient.tsx
'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase'; // your browser client

interface AdminPageClientProps {
    initialData: any[];
    activeTab: string;
}

const TABS = ['products', 'name_suffixes', 'categories', 'orders'];

export default function AdminPageClient({
                                            initialData,
                                            activeTab,
                                        }: AdminPageClientProps) {
    const [data, setData]       = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState<string | null>(null);

    const router        = useRouter();
    const searchParams  = useSearchParams();
    const currentTab    = searchParams.get('tab') ?? activeTab;

    const handleTabChange = async (tab: string) => {
        if (tab === currentTab) return;
        // update URL without a full page reload
        router.replace(`/admin?tab=${tab}`, { scroll: false });
        setLoading(true);
        setError(null);

        // fetch new data from Supabase
        const { data: rows, error: fetchError } = await supabase
            .from(tab)
            .select('*');

        if (fetchError) {
            setError(fetchError.message);
            setData([]);
        } else {
            setData(rows || []);
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => handleTabChange(tab)}
                        className={tab === currentTab ? 'active-tab-btn' : 'tab-btn'}
                        style={{
                            marginInlineEnd: '0.5rem',
                            padding: '0.5rem 1rem',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                            background: tab === currentTab ? '#ec4899' : '#8b5cf6',
                            color: 'white',
                        }}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {loading ? (
                <p>Loading…</p>
            ) : error ? (
                <p style={{ color: 'red' }}>Error: {error}</p>
            ) : data.length === 0 ? (
                <p>No rows in <strong>{currentTab}</strong></p>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                        <tr>
                            {Object.keys(data[0]).map((col) => (
                                <th
                                    key={col}
                                    style={{
                                        borderBottom: '1px solid #ddd',
                                        textAlign: 'left',
                                        padding: '0.5rem',
                                    }}
                                >
                                    {col}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {data.map((row, i) => (
                            <tr key={i}>
                                {Object.values(row).map((val, j) => (
                                    <td
                                        key={j}
                                        style={{
                                            borderBottom: '1px solid #f0f0f0',
                                            padding: '0.5rem',
                                        }}
                                    >
                                        {String(val)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
