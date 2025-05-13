'use client';

import React, {useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {supabase} from '@/lib/supabase';
import TabButtons from './TabButtons';

import styles from "./AdminPageClient.module.css";
import {Column, CrudTable} from "@/components/CrudTable";

const tabs: Record<string, { orderBy: string, columns: Column<any>[] }> = {
    products: {
        orderBy: 'title',
        columns: [
            {key: 'title', label: 'Title', editable: true},
            {key: 'price', label: 'Price', editable: true},
            {key: 'description', label: 'Description', editable: true},
            {key: 'slug', label: 'Slug', editable: true},
            {key: 'visible', label: 'Visible', type: 'boolean', editable: true},
            {key: 'in_stock', label: 'In Stock', type: 'boolean', editable: true},
            {key: 'is_new', label: 'Is New', type: 'boolean', editable: true},
            {key: 'is_soon', label: 'Is Soon', type: 'boolean', editable: true},
            {key: 'weight', label: 'Weight', editable: true},
            {
                key: 'image_url',
                label: 'Image',
                render: (url) => {
                    if (url) {
                        const {data: {publicUrl}} = supabase.storage
                            .from('product-images')
                            .getPublicUrl(url + '.jpg');
                        return <img src={publicUrl} width={50} alt={'img'}/>
                    } else {
                        return 'No image';

                    }
                },
            },
        ]
    },
    orders: {
        orderBy: 'order_date',
        columns: [
            {key: 'id', label: 'ID'},
            {key: 'customer_name', label: 'Customer', editable: true},
            {key: 'order_date', label: 'Order Date', editable: true},
            // …add more fields you care about
        ]
    },
    name_suffixes: {
        orderBy: 'id',
        columns: [
            {key: 'id', label: 'ID'},
            {key: 'suffix', label: 'Suffix', editable: true},
        ]
    },
    ingredients: {
        orderBy: 'name',
        columns: [
            {key: 'id', label: 'ID'},
            {key: 'price_per_100g', label: 'Price per 100g', editable: true},
            {key: 'name', label: 'Name', editable: true},
        ]
    },
    product_ingredients: {
        orderBy: 'product_id',
        columns: [
            {
                key: 'product_id',
                label: 'Product',
                editable: true,
                options: {fromTable: 'products', valueKey: 'id', labelKey: 'title'}
            },
            {
                key: 'ingredient_id',
                label: 'Ingredient',
                editable: true,
                options: {fromTable: 'ingredients', valueKey: 'id', labelKey: 'name'}
            },
            {key: 'weight', label: 'Weight (g)', editable: true},
        ]
    },

};

export default function AdminPageClient() {
    const router = useRouter();
    const [currentTab, setCurrentTab] = useState(useSearchParams().get('tab') || Object.keys(tabs)[0]);


    const handleTabChange = async (tab: string) => {
        setCurrentTab(tab);
        router.replace(`/data?tab=${tab}`, {scroll: false});
    };

    return (
        <div className={styles.AdminPageClient_69}>
            <TabButtons tabs={Object.keys(tabs)} currentTab={currentTab} onTabChange={handleTabChange}/>
            <CrudTable
                table={currentTab}
                definitions={tabs[currentTab] || []}
                uniqueKey="id"
            />
        </div>
    );
}
