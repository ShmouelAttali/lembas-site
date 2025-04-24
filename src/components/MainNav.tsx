// src/components/MainNav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MainNav() {
    const path = usePathname();

    return (
        <nav className="main-nav">
            <Link href="/" className={path === '/' ? 'active' : ''}>
                בית
            </Link>
            <Link
                href="/admin"
                className={path === '/admin' ? 'active' : ''}
            >
                ניהול
            </Link>
        </nav>
    );
}
