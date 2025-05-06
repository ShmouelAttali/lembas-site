import '@/styles/styles.css';
import React from 'react';
import {CartProvider} from '@/contexts/CartContext';
import Header from '@/components/Header';
import type {ReactNode} from 'react';
import {supabaseServer} from '@/lib/supabase-server';
import SupabaseProvider from '@/components/SupabaseProvider';
import {GlobalLoaderProvider} from '@/components/GlobalLoaderProvider';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {Analytics} from "@vercel/analytics/react";

export default async function RootLayout({children}: { children: ReactNode }) {
    const supabase = await supabaseServer();
    const {data: suffixes, error} = await supabase.rpc('get_random_suffix', {});
    const suffix = error || !suffixes?.length ? '' : suffixes[0].suffix;

    return (
        <html lang="he" dir="rtl">
        <body>
        <div className="page-wrapper">
            <SupabaseProvider>
                <CartProvider>
                    <Header suffix={suffix}/>
                    <GlobalLoaderProvider>
                        <main className="container">{children}</main>
                        <footer>
                            <p>לכל שאלה ופניה אפשר ליצור קשר <a href="https://wa.me/972542338344"
                                                                target="_blank">בוואטסאפ</a></p>
                            <p>בטלפון - <a href="tel:+972542338344">0542338344</a>, או באימייל - <a
                                href="mailto:ester.attali@gmail.com">ester.attali@gmail.com</a></p>
                        </footer>
                    </GlobalLoaderProvider>
                </CartProvider>
            </SupabaseProvider>
        </div>
        </body>
        </html>
    );
}
