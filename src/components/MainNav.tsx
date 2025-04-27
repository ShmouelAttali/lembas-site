// src/components/MainNav.tsx
'use client';

import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {useSessionContext} from "@supabase/auth-helpers-react";

export default function MainNav() {
    const path = usePathname();
    const {session} = useSessionContext();
    console.log(session);
    const isAdmin = session?.user?.app_metadata?.role === 'admin';

    return (
        <nav className="main-nav">
            <Link href="/" className={path === '/' ? 'active' : ''}>
                בית
            </Link>
            {isAdmin && (
                <Link
                    href="/admin"
                    className={path.startsWith('/admin') ? 'active' : ''}
                >
                    ניהול
                </Link>
            )}
        </nav>
    );
}
