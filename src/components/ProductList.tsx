'use client';

import React from 'react';
import {useCart} from '@/contexts/CartContext';

export type Product = {
    id: string;
    title: string;
    description: string;
    image_url: string;
    weight: string;
    price: number;
};

export default function ProductList({products}: { products: Product[] }) {
    const {addItem} = useCart();

    return (
        <section className="products">
            {products.map((p) => (
                <div key={p.id} className="product-card">
                    <img src={p.image_url} alt={p.title} className="product-thumb"/>
                    <div className="product-info">
                        <h3>{p.title}</h3>
                        <p>{p.description}</p>
                        <p>{p.weight + ' גרם'}</p>
                        <p>{'₪' + p.price}</p>
                        <button
                            className="add-to-cart"
                            onClick={() =>
                                addItem({id: p.id, title: p.title, price: p.price})
                            }
                        >
                            הוסף לסל
                        </button>
                    </div>
                </div>
            ))}
        </section>
    );
}
