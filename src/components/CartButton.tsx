// components/CartButton.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';
import { ShoppingCart } from 'lucide-react';

export default function CartButton() {
  const { items } = useCart();
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Link href="/cart" className="relative inline-block">
      <ShoppingCart size={24} />
      {totalCount > 0 && (
        <span
          className="
            absolute -top-1 -right-2
            flex h-5 w-5 items-center justify-center
            rounded-full bg-red-600 text-xs text-white
          "
        >
          {totalCount}
        </span>
      )}
    </Link>
  );
}
