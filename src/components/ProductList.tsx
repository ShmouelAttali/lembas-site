'use client';

import React from 'react';
import ProductThumb from "@/components/ProductThumb";
import styles from "./ProductList.module.css";
export type Product = {
    id: string;
    title: string;
    description: string;
    image_url1: string;
    image_url2: string;
    weight: string;
    price: number;
    in_stock: boolean;
};

export default function ProductList({products}: { products: Product[] }) {
    return (
        <section className={styles.products}>
            {products.map((p) => (
                <ProductThumb key={p.id} product={p}/>
            ))}
        </section>
    );
}
