'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MainNav from './MainNav';
import CartMinimized from './CartMinimized';
import type {FC} from 'react';
import {useGlobalLoader} from "@/components/GlobalLoaderProvider";

interface HeaderProps {
    suffix: string;
}

const Header: FC<HeaderProps> = ({suffix}) => {
    const { loading } = useGlobalLoader();

    return (
        <header className="header">
            <div className="container header-inner">
                <CartMinimized/>
                <Link href="/" className="logo-container">
                    <img
                        className={"logo-svg"}
                        srcSet="/lembasLogo.svg 358w, /lembasLogo-vertical.svg 595w"
                        sizes="(max-width: 600px) 595px, 358px"
                        alt="למבס logo"
                        // width={}
                        // height={65}
                    />
                    <h1 className="suffix">{suffix}</h1>
                </Link>

                {/*<div className="header-button-items">*/}
                    <MainNav/>
                    {loading && <div className="small-spinner" aria-label="Loading"></div>}
                {/*</div>*/}
            </div>
        </header>
    );
};

export default Header;
