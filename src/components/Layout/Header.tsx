'use client';

import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import MainNav from './MainNav';
import {useGlobalLoader} from "@/components/GlobalLoaderProvider";
import styles from './Header.module.css';
import CartMinimized from "@/components/Cart/CartMinimized";

interface HeaderProps {
    suffix: string;
}

const Header: React.FC<HeaderProps> = ({suffix}) => {
    const {loading} = useGlobalLoader();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const isMobile = window.innerWidth <= 600;

            const shrinkUpperThreshold = isMobile ? 180 : 200;
            const shrinkLowerThreshold = isMobile ? 30 : 30;

            // Scrolling Down
            if (currentScrollY > lastScrollY && currentScrollY > shrinkUpperThreshold) {
                setScrolled(true);
            } else if (currentScrollY < lastScrollY && currentScrollY < shrinkLowerThreshold) {
                setScrolled(false);

            }
            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
            <div className={styles.headerInner}>
                <Link href="/" className={styles.logoContainer}>
                    <img
                        className={styles.logoSvg}
                        srcSet="/lembasLogo.svg"
                        alt="למבס logo"
                    />
                    <h1 className={styles.suffix}>{suffix}</h1>
                </Link>
                <div className={styles.buttons}>
                    <CartMinimized/>
                    <MainNav/>
                </div>
                {loading && <div className={styles.spinner} aria-label="Loading"></div>}
            </div>
        </header>
    );
};

export default Header;
