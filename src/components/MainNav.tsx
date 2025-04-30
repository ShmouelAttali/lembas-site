import {usePathname} from "next/navigation";
import {useSessionContext} from "@supabase/auth-helpers-react";
import {useState} from "react";
import Link from "next/link";
import '@/styles/main-nav.css'

export default function MainNav() {
    const path = usePathname();
    const {session} = useSessionContext();
    const isAdmin = session?.user?.app_metadata?.role === 'admin';
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="main-nav">
            {/* Top bar: always show Home + toggle */}
            <div className="nav-top">
                <Link href="/" className={path === '/' ? 'active' : ''}>
                    בית
                </Link>
                {isAdmin && <button
                    className="mobile-menu-toggle"
                    aria-label={menuOpen ? 'סגור תפריט' : 'פתח תפריט'}
                    onClick={() => setMenuOpen((o) => !o)}
                >
                    ☰
                </button>}
            </div>

            {/* Menu drawer/popover */}
            <div className={`menu-items ${menuOpen ? 'show' : ''}`}  onClick={() => setMenuOpen(false)}>
                {isAdmin && (
                    <>
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
                    </>
                )}
            </div>
        </nav>
    );
}