'use client';

import React, {useEffect} from 'react';
import {useCart} from '@/contexts/CartContext';
import styles from './CartPopup.module.css';
import {Trash} from "lucide-react";
import {motion} from "framer-motion";
import {useRouter} from "next/navigation";
import {EmptyCartMessage} from "@/components/Cart/EmptyCartMessage";

type Props = {
    onClose: () => void;
};

export default function CartPopup({onClose}: Props) {
    const {items, total, clearCart, updateItem, removeItem} = useCart();
    const router = useRouter();

    // Close on ESC key
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onClose]);

    return (
        <motion.div
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            exit={{opacity: 0}}
            transition={{duration: 0.3}}
            className={styles.overlay}
            onClick={onClose}
        >
            <motion.div
                initial={{opacity: 0, scale: 0.95}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.95}}
                transition={{duration: 0.3}}
                className={styles.popup}
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className={styles.closeButton}>X</button>

                <h2 className={styles.popupTitle}>העגלה שלי</h2>

                {items.length === 0 ? (
                    <EmptyCartMessage/>
                ) : (
                    <>
                        <ul className={styles.itemsList}>
                            {items.map((item) => (
                                <li key={item.id} className={styles.item}>
                                    <p className={styles.title}>{item.title}</p>

                                    <div className={styles.quantityControl}>
                                        <button onClick={() => updateItem(item.id, item.quantity - 1)}>-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => updateItem(item.id, item.quantity + 1)}>+</button>
                                    </div>

                                    <span className={styles.price}>₪{(item.price * item.quantity).toFixed(2)}</span>

                                    <button onClick={() => removeItem(item.id)}>
                                        <Trash color={"#41780c"} size={20}/>
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className={styles.total}>
                            <p>סה&quot;כ: ₪{total.toFixed(2)}</p>
                        </div>

                        <div className={styles.popupActions}>
                            <button className={styles.secondaryButton} onClick={clearCart}>נקה עגלה</button>
                            <button onClick={() => {
                                onClose();
                                router.push('/checkout');
                            }}>המשך לתשלום
                            </button>
                        </div>
                    </>
                )}
            </motion.div>
        </motion.div>
    );
}
