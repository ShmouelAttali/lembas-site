// src/components/CartMinimized.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { motion, useAnimation } from 'framer-motion';
import styles from "./CartMinimized.module.css";

export default function CartMinimized() {
    const { items, total } = useCart();
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const controls = useAnimation();

    // 1) Bump animation
    useEffect(() => {
        if (count > 0) {
            controls.start({
                scale: [1, 1.3, 1],
                transition: { duration: 0.3, ease: 'easeInOut' },
            });
        }
    }, [count, controls]);

    // 2) Popup guard: only allow popups after the first 500 ms
    const [allowPopup, setAllowPopup] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setAllowPopup(true), 500);
        return () => clearTimeout(t);
    }, []);

    // 3) Popup logic
    const prevCount = useRef(count);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        if (!allowPopup) {
            prevCount.current = count;
            return;
        }
        if (count > prevCount.current) {
            setShowPopup(true);
            const t = setTimeout(() => setShowPopup(false), 2000);
            return () => clearTimeout(t);
        }
        prevCount.current = count;
    }, [count, allowPopup]);

    return (
        <Link href="/cart" className="cart-minimized">
            <motion.div
                animate={controls}
                className={styles.CartMinimized_54}
            >
                <div
                    // src="/icons/bag.svg"
                    // alt="Cart"
                    // width={30}
                    // height={30}
                    className="bag-icon"
                />
                {count > 0 && (
                    <span className="badge" aria-hidden="true">
            {count}
          </span>
                )}
                {showPopup && (
                    <div className="cart-popup">
                        המוצר התווסף לסל
                    </div>
                )}
            </motion.div>
            <span className="cart-summary">
        {count} פריטים — ₪{total.toFixed(2)}
      </span>
        </Link>
    );
}
