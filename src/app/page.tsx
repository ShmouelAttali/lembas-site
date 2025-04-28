import React from 'react';
import ProductList from '@/components/ProductList';
import {supabaseServer} from '@/lib/supabase-server';
import {addDays, getNextMDates} from '@/app/utils';
import SelectOrderDate from '@/components/SelectOrderDate';

export default async function HomePage() {
    const supabase = await supabaseServer();

    // fetch products
    const {data: products} = await supabase
        .from('products')
        .select('id,title,description,price,slug,weight,image_url')
        .order('title') || {data: []};

    let tomorrow = addDays(new Date(), 1).toISOString().slice(0, 10);
    const {data: datesStr} = await supabase.from('order_dates').select('date').gt('date', tomorrow).limit(3).order('date');
    const dates = datesStr?.map(d => new Date(d.date)) ?? [];
    console.log(dates);
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
    return (
        <>
            <img src='/bread.jpg' alt="Bread" className="cover-photo"/>
            <section className="booking">
                <h2>בחר תאריך להזמנה</h2>
                <SelectOrderDate dates={dates}/>
            </section>
            <ProductList products={prods}/>
        </>
    );
}
