'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MainNav from './MainNav';
import CartMinimized from './CartMinimized';
import type {FC} from 'react';
import {useGlobalLoader} from "@/components/GlobalLoaderProvider";

interface HeaderProps {
    siteName: string;
}

const Header: FC<HeaderProps> = ({siteName}) => {
    const { loading } = useGlobalLoader();

    return (
        <header className="header">
            <div className="container header-inner">
                <Link href="/" className="logo-container">
                    <Image
                        className={"logo-svg"}
                        src="/lembasLogo.svg"
                        alt="למבס logo"
                        width={100}
                        height={65}
                    />
                    <h1 className="site-name">{siteName}</h1>
                </Link>

                <div className="header-button-items">
                    <CartMinimized/>
                    <MainNav/>
                    {loading && <div className="small-spinner" aria-label="Loading"></div>}
                </div>
            </div>
        </header>
    );
};

export default Header;
