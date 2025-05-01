import React from 'react';
import ProductList from '@/components/ProductList';
import {supabaseServer} from '@/lib/supabase-server';
import {addDays} from '@/app/utils';
import SelectOrderDate from '@/components/SelectOrderDate';

export default async function HomePage() {
    const supabase = await supabaseServer();

    // fetch products
    const {data: products} = await supabase
        .from('products_with_buy_counts')
        .select('*')
        .eq('visible', true)
        .order('buy_count', {ascending: false})

    const tomorrow = addDays(new Date(), 1).toISOString().slice(0, 10);
    const {data: datesStr} = await supabase.from('order_dates').select('date').gt('date', tomorrow).limit(3).order('date');
    const dates = datesStr?.map(d => new Date(d.date)) ?? [];
    const prods = (products || []).map((p) => {
        p.image_url1 = supabase.storage.from('product-images').getPublicUrl(p.image_url1 + '.jpg').data.publicUrl;
        p.image_url2 = supabase.storage.from('product-images').getPublicUrl(p.image_url2 + '.jpg').data.publicUrl;
        return {...p, weight: p.weight !== null ? String(p.weight) : "N/A"};
    });
    return (
        <>
            <img src='/bread1.JPG' alt="Bread" className="cover-photo"/>
            <section className="booking">
                <h2>בחר תאריך להזמנה</h2>
                <SelectOrderDate dates={dates}/>
            </section>
            <ProductList products={prods}/>
        </>
    );
}
