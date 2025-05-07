import React from 'react';
import ProductList from '@/components/ProductList';
import {supabaseServer} from '@/lib/supabase-server';
import {addDays} from '@/app/utils';
import {getFormattedDateLabel} from "@/app/utils";

export default async function HomePage() {
    const supabase = await supabaseServer();

    // fetch products
    const {data: products} = await supabase
        .from('products_with_buy_counts')
        .select('*')
        .eq('visible', true).order('in_stock', {ascending: false})
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
            <img src='/bread1.JPG' alt="Bread" className="cover-photo"/>

            <div className={"main-info"}>
                <p className={"bold"}>ברוכים הבאים!</p>
                <br/>
                <p>הלחמים שלנו מוכנים ללא שמרים תעשייתים כלל, עם הרבה יחס אישי ובאפייה ביתית.</p>
                <p>התפחה באמצעות מחמצת דורשת תהליכים ארוכים, אבל נותנת תוצר שהוא ייחודי בטעם ובאיכות ושונה מלחם
                    רגיל.</p>
                <p>זו הסיבה לכך שיש להזמין את הלחם שלנו לפחות יומיים מראש - כדי להבטיח שהוא יהיה מוכן בזמן ומותסס
                    היטב.</p>
                <br/>
                <p className={"bold"}>הזמינו עכשיו כדי לקבל את הלחם הטרי שלכם כבר ביום {getFormattedDateLabel(dates[0], true)} הקרוב.</p>


            </div>
            <ProductList products={prods}/>
        </>
    );
}
