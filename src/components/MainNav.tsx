'use client'
import {usePathname, useRouter} from "next/navigation";
import {useSessionContext} from "@supabase/auth-helpers-react";
import React, {useState, useEffect, useRef} from "react";
import Link from "next/link";
import '@/styles/main-nav.css'
import Image from "next/image";

export default function MainNav() {
    const {session, supabaseClient} = useSessionContext();
    const router = useRouter();
    const path = usePathname();
    const isAdmin = session?.user?.app_metadata?.role === 'admin';
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);


    const handleLogout = async () => {
        await supabaseClient.auth.signOut();
        router.push('/');
        setMenuOpen(false);
    };

    const userName =
        session?.user.user_metadata?.full_name ?? session?.user.email;

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && event.target instanceof Node && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    // Close menu when clicking any link inside
    const handleMenuClick = () => {
        setMenuOpen(false);
    };

    return (
        <nav className="main-nav">
            <div className="nav-top">
                <button
                    className="mobile-menu-toggle"
                    aria-label={menuOpen ? 'סגור תפריט' : 'פתח תפריט'}
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        setMenuOpen((o) => !o);
                    }}
                >
                    {session?.user ? (
                        <Image
                            src={session.user.user_metadata.picture}
                            alt="Your avatar"
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                    ) : (
                        <p>☰</p>
                    )}
                </button>
            </div>

            <div
                ref={menuRef}
                className={`menu-items ${menuOpen ? 'show' : ''}`}
            >
                <div className="user-name">{userName}</div>

                {session?.user ? (
                    <button
                        onClick={handleLogout}
                        className="logout"
                        aria-label="Logout"
                    >
                        התנתק
                    </button>
                ) : (
                    <Link href="/login" className="login" aria-label="Login or Register" onClick={handleMenuClick}>
                        התחבר/הרשם
                    </Link>
                )}

                <div className="line"></div>

                <Link href="/" className={path === '/' ? 'active' : ''} onClick={handleMenuClick}>
                    בית
                </Link>

                {isAdmin && (
                    <>
                        <Link href="/order-summary" className={path.startsWith('/order-summary') ? 'active' : ''}
                              onClick={handleMenuClick}>
                            ניהול הזמנות
                        </Link>
                        <Link href="/data" className={path.startsWith('/data') ? 'active' : ''}
                              onClick={handleMenuClick}>
                            נתונים
                        </Link>
                        <Link href="/recipes" className={path.startsWith('/recipes') ? 'active' : ''}
                              onClick={handleMenuClick}>
                            מתכונים
                        </Link>
                        <Link href="/calculator" className={path.startsWith('/calculator') ? 'active' : ''}
                              onClick={handleMenuClick}>
                            מחשבון מחמצת
                        </Link>
                        <Link href="/order-dates" className={path.startsWith('/order-dates') ? 'active' : ''}
                              onClick={handleMenuClick}>
                            תאריכי הזמנה
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
