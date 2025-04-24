import '@/styles/styles.css';
import React from 'react';
import { CartProvider } from '@/contexts/CartContext';
import Header from '@/components/Header';
import type { ReactNode } from 'react';
import { supabaseServer } from '@/lib/supabase-server';

export default async function RootLayout({ children }: { children: ReactNode }) {
    // Fetch a random site-name suffix on the server
    const supabase = await supabaseServer();
    const { data: suffixes, error } = await supabase.rpc('get_random_suffix', {});
    const suffix = error || !suffixes?.length ? '' : suffixes[0].suffix;
    const siteName = `למבס - ${suffix}`;

    return (
        <html lang="he" dir="rtl">
        <body>
        <CartProvider>
            <Header siteName={siteName} />
            <main className="container">{children}</main>
        </CartProvider>
        </body>
        </html>
    );
}
