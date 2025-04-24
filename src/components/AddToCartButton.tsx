// components/AddToCartButton.tsx
'use client';

import React from 'react';
import { useCart } from '@/contexts/CartContext';

export interface CartProduct {
  id: string;
  title: string;
  price: number;
}

interface AddToCartButtonProps {
  product: CartProduct;
  disabled?: boolean;
}

export default function AddToCartButton({
  product,
  disabled = false,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const handleClick = () => {
    addItem({ ...product, quantity: 1 });
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`
        inline-block px-6 py-3
    bg-accent hover:bg-accent/90
    text-background font-bold
    rounded-full
    transition
      `}
    >
      Add to Cart
    </button>
  );
}
