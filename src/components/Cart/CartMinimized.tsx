'use client';

import React, {useEffect, useRef, useState} from 'react';
import {useCart} from '@/contexts/CartContext';
import {AnimatePresence, motion, useAnimation} from 'framer-motion';
import styles from "./CartMinimized.module.css";
import CartPopup from "@/components/Cart/CartPopup";

export default function CartMinimized() {
    const {items, total} = useCart();
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const controls = useAnimation();

    const [showPopup, setShowPopup] = useState(false);

    // Bump animation
    useEffect(() => {
        if (count > 0) {
            controls.start({
                scale: [1, 1.3, 1],
                transition: {duration: 0.3, ease: 'easeInOut'},
            });
        }
    }, [count, controls]);

    // 2) Popup guard: only allow popups after the first 500 ms
    const [allowPopup, setAllowPopup] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setAllowPopup(true), 500);
        return () => clearTimeout(t);
    }, []);

    // Item added popup
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

    return (
        <>
            <div className={styles.CartMinimizedWrapper + ' cart-minimized'}
                 onClick={() => setShowPopup(true)}
            >
                <motion.div
                    animate={controls}
                    className={styles.CartMinimized_54}
                >
                    <div className={styles.bagIcon}/>
                    {count > 0 && <span className={styles.badge}>{count}</span>}
                    {showAddPopup && <div className={styles.cartPopup}>המוצר התווסף לסל</div>}
                </motion.div>

                <span className={styles.cartSummary}>
                    {count} פריטים — ₪{total.toFixed(2)}
                </span>
            </div>

            <AnimatePresence>
                {showPopup && (
                    <CartPopup onClose={() => setShowPopup(false)}/>
                )}
            </AnimatePresence>
        </>
    );
}
