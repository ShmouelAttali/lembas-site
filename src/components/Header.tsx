'use client';

import React from 'react';
import Image from 'next/image';
import MainNav from './MainNav';
import CartMinimized from './CartMinimized';
import type { FC } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { User, LogOut } from 'lucide-react';

interface HeaderProps {
    siteName: string;
}

const Header: FC<HeaderProps> = ({ siteName }) => {
    const { session, supabaseClient } = useSessionContext();
    const router = useRouter();

    const handleLogout = async () => {
        await supabaseClient.auth.signOut();
        router.push('/login');
    };

    // display full_name if set, otherwise email
    const userName =
        session?.user.user_metadata?.full_name ?? session?.user.email;

    return (
        <header className="header">
            <div className="container header-inner">
                <div className="logo-container">
                    <Image
                        src="/logo.jpg"
                        alt="למבס logo"
                        width={120}
                        height={40}
                    />
                    <h1 className="site-name">{siteName}</h1>
                </div>

                <MainNav />

                <CartMinimized />

                <div className="user-controls flex items-center gap-2">
                    {session?.user ? (
                        <>
                            <Image
                                src={session.user.user_metadata.picture}
                                alt="Your avatar"
                                width={32}
                                height={32}
                                className="rounded-full"
                            />
                            <span className="user-name">{userName}</span>
                            <button
                                onClick={handleLogout}
                                className="btn-icon"
                                aria-label="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="btn-icon"
                            aria-label="Login or Register"
                        >
                            <User size={20} />
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
