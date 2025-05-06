import '@/styles/styles.css';
import React from 'react';
import {CartProvider} from '@/contexts/CartContext';
import Header from '@/components/Header';
import type {ReactNode} from 'react';
import {supabaseServer} from '@/lib/supabase-server';
import SupabaseProvider from '@/components/SupabaseProvider';
import { GlobalLoaderProvider } from '@/components/GlobalLoaderProvider';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Analytics } from "@vercel/analytics/react";

export default async function RootLayout({children}: { children: ReactNode }) {
    const supabase = await supabaseServer();
    const {data: suffixes, error} = await supabase.rpc('get_random_suffix', {});
    const suffix = error || !suffixes?.length ? '' : suffixes[0].suffix;

    return (
        <html lang="he" dir="rtl">
        <body>
        <SupabaseProvider>
            <CartProvider>
                <Header suffix={suffix}/>
                <GlobalLoaderProvider>
                    <main className="container">{children}</main>
                </GlobalLoaderProvider>
            </CartProvider>
        </SupabaseProvider>
        </body>
        </html>
    );
}
