'use client'
import {usePathname, useRouter} from "next/navigation";
import {useSessionContext} from "@supabase/auth-helpers-react";
import React, {useState} from "react";
import Link from "next/link";
import '@/styles/main-nav.css'
import Image from "next/image";
import {LogOut, User} from "lucide-react";

export default function MainNav() {
    const {session, supabaseClient} = useSessionContext();
    const router = useRouter();
    const path = usePathname();
    const isAdmin = session?.user?.app_metadata?.role === 'admin';
    const [menuOpen, setMenuOpen] = useState(false);
    const handleLogout = async () => {
        await supabaseClient.auth.signOut();
        router.push('/');
    };
    // display full_name if set, otherwise email
    const userName =
        session?.user.user_metadata?.full_name ?? session?.user.email;

    return (
        <nav className="main-nav">
            {/* Top bar: always show Home + toggle */}
            <div className="nav-top">
                <button
                    className="mobile-menu-toggle"
                    aria-label={menuOpen ? 'סגור תפריט' : 'פתח תפריט'}
                    onClick={() => setMenuOpen((o) => !o)}
                >
                    {session?.user ? (
                        <>
                            <Image
                                src={session.user.user_metadata.picture}
                                alt="Your avatar"
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                        </>
                    ) : (
                        <>
                            <p>
                                ☰
                            </p>
                        </>
                    )}
                </button>
            </div>

            {/* Menu drawer/popover */}
            <div className={`menu-items ${menuOpen ? 'show' : ''}`} onClick={() => setMenuOpen(false)}>
                <div className="user-name">{userName}</div>
                {session?.user ? (
                        <button
                            onClick={handleLogout}
                            className="logout"
                            aria-label="Logout"
                        >
                            התנתק
                        </button>
                    ):
                    <>
                        <Link
                            href="/login"
                            className="login"
                            aria-label="Login or Register"
                        >
                            התחבר/הרשם
                        </Link></>
                }
                <div className="line"/>
                <Link href="/" className={path === '/' ? 'active' : ''}>
                    בית
                </Link>

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