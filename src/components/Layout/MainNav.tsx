'use client'
import {usePathname, useRouter} from "next/navigation";
import {useSessionContext} from "@supabase/auth-helpers-react";
import React, {useEffect, useRef, useState} from "react";
import Link from "next/link";
import Image from "next/image";
import styles from './MainNav.module.css';

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

    const userName = session?.user.user_metadata?.full_name ?? session?.user.email;
console.log(session, session?.user, session?.user.user_metadata.name);
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
        <nav className={styles.mainNav}>
            <div className={styles.navTop}>
                <button
                    className={styles.mobileMenuToggle}
                    aria-label={menuOpen ? 'סגור תפריט' : 'פתח תפריט'}
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        setMenuOpen((o) => !o);
                    }}
                >
                    {session?.user ? (
                        <Image
                            src={session.user.user_metadata.picture ?? '/icons/default_avatar.svg'}
                            alt="Your avatar"
                            width={46}
                            height={46}
                            className={styles.roundedFull}
                        />
                    ) : (
                        <p>☰</p>
                    )}
                </button>
            </div>

            <div
                ref={menuRef}
                className={`${styles.menuItems} ${menuOpen ? styles.menuItemsShow : ''}`}
            >
                <div className={styles.menuItemsUserName}>{userName}</div>

                {session?.user ? (
                    <>
                        <button
                            onClick={handleLogout}
                            className={styles.menuItemsLogout}
                            aria-label="Logout"
                        >
                            התנתק
                        </button>
                        <Link href="/user-orders"
                              className={`${styles.menuItemLink} ${path.startsWith('/user-orders') ? styles.menuItemLinkActive : ''}`}
                              onClick={handleMenuClick}>
                            הזמנות קודמות
                        </Link>
                    </>
                ) : (
                    <Link href="/login" className={styles.menuItemsLogin} aria-label="Login or Register"
                          onClick={handleMenuClick}>
                        התחבר/הרשם
                    </Link>
                )}

                <div className={styles.line}></div>

                <Link href="/" className={`${styles.menuItemLink} ${path === '/' ? styles.menuItemLinkActive : ''}`}
                      onClick={handleMenuClick}>
                    בית
                </Link>

                {isAdmin && (
                    <>
                        <Link href="/order-summary"
                              className={`${styles.menuItemLink} ${path.startsWith('/order-summary') ? styles.menuItemLinkActive : ''}`}
                              onClick={handleMenuClick}>
                            ניהול הזמנות
                        </Link>
                        <Link href="/data"
                              className={`${styles.menuItemLink} ${path.startsWith('/data') ? styles.menuItemLinkActive : ''}`}
                              onClick={handleMenuClick}>
                            נתונים
                        </Link>
                        <Link href="/recipes"
                              className={`${styles.menuItemLink} ${path.startsWith('/recipes') ? styles.menuItemLinkActive : ''}`}
                              onClick={handleMenuClick}>
                            מתכונים
                        </Link>
                        <Link href="/calculator"
                              className={`${styles.menuItemLink} ${path.startsWith('/calculator') ? styles.menuItemLinkActive : ''}`}
                              onClick={handleMenuClick}>
                            מחשבון מחמצת
                        </Link>
                        <Link href="/order-dates"
                              className={`${styles.menuItemLink} ${path.startsWith('/order-dates') ? styles.menuItemLinkActive : ''}`}
                              onClick={handleMenuClick}>
                            תאריכי הזמנה
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
