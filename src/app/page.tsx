import React from 'react';
import {supabaseServer} from '@/lib/supabase-server';
import {addDays, getFormattedDateLabel} from '@/lib/utils';
import styles from './HomePage.module.css'
import ProductList from "@/components/Product/ProductList";

export default async function HomePage() {
    const supabase = await supabaseServer();

    // fetch products
    const {data: products} = await supabase
        .from('products_with_buy_counts')
        .select('*')
        .eq('visible', true)
        .order('in_stock', {ascending: false})
        .order('is_soon', {ascending: false})
        .order('is_new', {ascending: false})
        .order('buy_count', {ascending: false})

    const tomorrow = addDays(new Date(), 1).toISOString().slice(0, 10);
    const {data: datesStr} = await supabase.from('order_dates').select('date').gt('date', tomorrow).limit(3).order('date');
    const dates = datesStr?.map(d => new Date(d.date)) ?? [];
    const prods = (products || []).map((p) => {
        p.image_url1 = supabase.storage.from('product-images').getPublicUrl(p.slug + '1-thumb.jpg').data.publicUrl;
        p.image_url2 = supabase.storage.from('product-images').getPublicUrl(p.slug + '2-thumb.jpg').data.publicUrl;
        return {...p, weight: p.weight !== null ? String(p.weight) : "N/A"};
    });
    return (
        <>
            <img src='/bread1.JPG' alt="Bread" className={styles.coverPhoto}/>

            <div className={styles.mainInfo}>
                <p className={styles.header + " notoHeader"}>לחם עם אופי</p>
                <br/>
                <p>ב<span className={"lembas"}>לֶמבָּס</span> מכינים לחם טרי, איכותי ובעיקר טעים – בלי שמרים תעשייתיים
                    ובלי קיצורי דרך.</p>
                <p>הכל פה מחמצת, תהליך איטי שדורש לפחות יומיים מראש.</p>
                <p>כל כיכר תופחת לאט, מעוצבת באהבה ונאפית בזמן הנכון.</p>
                <br/>
                <div className={styles.orderNow}>הזמינו עכשיו – ותשכחו מלחם של סופר כבר
                    ביום {getFormattedDateLabel(dates[0], true)} הקרוב.
                </div>


            </div>
            <ProductList products={prods}/>
        </>
    );
}
