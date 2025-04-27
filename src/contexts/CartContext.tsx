// src/contexts/CartContext.tsx
'use client';

import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
} from 'react';
import {ItemInfo} from "@/types/types";

interface CartContextType {
    items: ItemInfo[];
    addItem: (item: Omit<ItemInfo, 'quantity'> & { quantity?: number }) => void;
    updateItem: (id: string, quantity: number) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<ItemInfo[]>([]);

    // Load saved cart from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem('cart');
            if (stored) setItems(JSON.parse(stored));
        } catch {}
    }, []);

    // Persist cart whenever it changes
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(items));
    }, [items]);

    const addItem = (item: Omit<ItemInfo, 'quantity'> & { quantity?: number }) => {
        console.log('add item', item, item.quantity);
        const qtyToAdd = item.quantity ?? 1;
        const existing = items.find((i) => i.id === item.id);
        if (existing) {
            // increase quantity by one discrete update
            const updated = items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + qtyToAdd } : i
            );
            setItems(updated);
        } else {
            setItems([...items, { ...item, quantity: qtyToAdd }]);
        }
    };

    const updateItem = (id: string, quantity: number) => {
        setItems((current) =>
            current
                .map((i) => (i.id === id ? { ...i, quantity } : i))
                .filter((i) => i.quantity > 0)
        );
    };

    const removeItem = (id: string) => {
        setItems((current) => current.filter((i) => i.id !== id));
    };

    const clearCart = () => {
        setItems([]);
    };

    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    return (
        <CartContext.Provider
            value={{ items, addItem, updateItem, removeItem, clearCart, total }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart(): CartContextType {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used within a CartProvider');
    return ctx;
}
