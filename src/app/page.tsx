// src/app/page.tsx
import React from 'react';
import ProductList from '@/components/ProductList';
import {supabaseServer} from '@/lib/supabase-server';
import {getNextMDates} from '@/app/utils';
import Image from 'next/image';
import SelectOrderDate from '@/components/SelectOrderDate';

export default async function HomePage() {
    const supabase = await supabaseServer();

    // fetch products
    const {data: products} = await supabase
        .from('products')
        .select('id,title,description,price,slug,weight,image_url')
        .order('title') || {data: []};

    const prods = (products || []).map((p) => {
        const {
            data: {publicUrl},
        } = supabase.storage.from('product-images').getPublicUrl(p.image_url + '.jpg');
        return {
            id: p.id,
            title: p.title,
            description: p.description || '',
            price: p.price,
            image_url: publicUrl,
            weight: p.weight !== null ? String(p.weight) : "N/A",
        };
    });

    // booking dates
    const dates = getNextMDates(3);

    return (
        <>
            <div className="logo-container">
                <Image src="/bread.jpg" alt="bread" width="300" height="300"/>
            </div>
            <section className="booking">
                <h2>בחר תאריך להזמנה</h2>
                <SelectOrderDate dates={dates}/>
            </section>
            <ProductList products={prods}/>
        </>
    );
}
