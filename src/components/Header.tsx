'use client';

import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import MainNav from './MainNav';
import CartMinimized from './CartMinimized';
import {useGlobalLoader} from "@/components/GlobalLoaderProvider";
import styles from './Header.module.css';

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

            const shrinkUpperThreshold = isMobile ? 180 : 100;
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
                <CartMinimized/>
                <Link href="/" className={styles.logoContainer}>
                    <img
                        className={styles.logoSvg}
                        srcSet="/lembasLogo.svg 358w, /lembasLogo-vertical.svg 595w"
                        sizes="(max-width: 600px) 595px, 358px"
                        alt="למבס logo"
                    />
                    <h1 className={styles.suffix}>{suffix}</h1>
                </Link>
                <MainNav/>
                {loading && <div className={styles.spinner} aria-label="Loading"></div>}
            </div>
        </header>
    );
};

export default Header;
