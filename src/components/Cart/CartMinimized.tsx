'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCart } from '@/contexts/CartContext';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import styles from './CartMinimized.module.css';
import CartPopup from '@/components/Cart/CartPopup';

export default function CartMinimized() {
    const { items, total } = useCart();
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const controls = useAnimation();
    const [showPopup, setShowPopup] = useState(false);

    const [allowPopup, setAllowPopup] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setAllowPopup(true), 500);
        return () => clearTimeout(t);
    }, []);

    const prevCount = useRef(count);
    const [showAddPopup, setShowAddPopup] = useState(false);

    useEffect(() => {
        if (!allowPopup) {
            prevCount.current = count;
            return;
        }
        if (count > prevCount.current) {
            setShowAddPopup(true);
            const t = setTimeout(() => setShowAddPopup(false), 2000);
            return () => clearTimeout(t);
        }
        prevCount.current = count;
    }, [count]);

    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 600);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <>
            <div
                className={`${styles.CartMinimizedWrapper} ${isMobile ? styles.mobile : ''}`}
                onClick={() => setShowPopup(true)}
            >
                <motion.div animate={controls} className={styles.CartMinimized_54}>
                    <div className={styles.bagIcon} />
                    {count > 0 && <span className={styles.badge}>{count}</span>}
                    {showAddPopup && <div className={styles.cartPopup}>המוצר התווסף לסל</div>}
                </motion.div>

                {!isMobile && (
                    <span className={styles.cartSummary}>
                        {count} פריטים — ₪{total.toFixed(2)}
                    </span>
                )}
            </div>

            <AnimatePresence>
                {showPopup && <CartPopup onClose={() => setShowPopup(false)} />}
            </AnimatePresence>
        </>
    );
}
