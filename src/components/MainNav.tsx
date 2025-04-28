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
                <div>
                    <Link
                        href="/order-summary"
                        className={path.startsWith('/order-summary') ? 'active' : ''}
                    >
                        ניהול הזמנות
                    </Link>
                    <Link
                        href="/data"
                        className={path.startsWith('/data') ? 'active' : ''}
                    >
                        נתונים
                    </Link>
                    <Link
                        href="/recipes"
                        className={path.startsWith('/recipes') ? 'active' : ''}
                    >
                        מתכונים
                    </Link>
                    <Link
                        href="/calculator"
                        className={path.startsWith('/calculator') ? 'active' : ''}
                    >
                        מחשבון מחמצת
                    </Link>
                    <Link
                        href="/order-dates"
                        className={path.startsWith('/order-dates') ? 'active' : ''}
                    >
                        תאריכי הזמנה
                    </Link>
                </div>
            )}
        </nav>
    );
}
