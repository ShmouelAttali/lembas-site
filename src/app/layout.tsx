import styles from './PageLayout.module.css'; // <-- new import
import '@/styles/styles.css'; // keep the global styles
import type {ReactNode} from 'react';
import React from 'react';
import {CartProvider} from '@/contexts/CartContext';
import {supabaseServer} from '@/lib/supabase-server';
import SupabaseProvider from '@/components/SupabaseProvider';
import {GlobalLoaderProvider} from '@/components/GlobalLoaderProvider';
import {Analytics} from "@vercel/analytics/react";
import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";

export default async function RootLayout({children}: { children: ReactNode }) {
    const supabase = await supabaseServer();
    const {data: suffixes, error} = await supabase.rpc('get_random_suffix', {});
    const suffix = error || !suffixes?.length ? '' : suffixes[0].suffix;

    return (
        <html lang="he" dir="rtl">
        <body>
        <div className={styles.pageWrapper}>
            <SupabaseProvider>
                <CartProvider>
                    <Header suffix={suffix}/>
                    <GlobalLoaderProvider>
                        <main className={styles.container}>{children}</main>
                        <Footer/>
                    </GlobalLoaderProvider>
                </CartProvider>
            </SupabaseProvider>
        </div>
        <Analytics/>
        </body>
        </html>
    );
}
