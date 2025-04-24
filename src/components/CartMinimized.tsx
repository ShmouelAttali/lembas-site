// src/components/CartMinimized.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

export default function CartMinimized() {
    const { items, total } = useCart();
    const count = items.reduce((sum, i) => sum + i.quantity, 0);

    return (
        <Link href="/cart" className="cart-minimized">
            <Image
                src="/shopping-cart.svg"
                alt=""
                width={30}
                height={30}
                className="bag-icon"
                unoptimized
            />
            <span className="cart-summary">
        {count} פריטים — ₪{total.toFixed(2)}
      </span>
            {count > 0 && (
                <span className="badge" aria-hidden="true">
          {count}
        </span>
            )}
        </Link>
    );
}
