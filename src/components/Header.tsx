'use client';

import React from 'react';
import Image from 'next/image';
import MainNav from './MainNav';
import CartMinimized from './CartMinimized';
import type { FC } from 'react';

interface HeaderProps {
    siteName: string;
}

const Header: FC<HeaderProps> = ({ siteName }) => (
    <header className="header">
        <div className="container header-inner">
            <div className="logo-container">
                <Image
                    src="/logo.jpg"
                    alt="למבס Logo"
                    width={120}
                    height={40}
                />
                <h1 className="site-name">{siteName}</h1>
            </div>

            <MainNav />

            <CartMinimized />
        </div>
    </header>
);

export default Header;
