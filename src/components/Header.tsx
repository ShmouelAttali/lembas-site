'use client';

import React from 'react';
import Image from 'next/image';
import MainNav from './MainNav';
import CartMinimized from './CartMinimized';
import type {FC} from 'react';

interface HeaderProps {
    siteName: string;
}

const Header: FC<HeaderProps> = ({siteName}) => {

    return (
        <header className="header">
            <div className="container header-inner">
                <div className="logo-container">
                    <Image
                        className={"logo-svg"}
                        src="/lembasLogo.svg"
                        alt="למבס logo"
                        width={100}
                        height={65}
                    />
                    <h1 className="site-name">{siteName}</h1>
                </div>

                <div className="header-left-items">
                    <CartMinimized/>
                    <MainNav/>
                </div>
            </div>
        </header>
    );
};

export default Header;
