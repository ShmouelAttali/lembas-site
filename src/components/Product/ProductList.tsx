'use client';

import React from 'react';
import styles from "./ProductList.module.css";
import ProductThumb from "@/components/Product/ProductThumb";

export type Product = {
    id: string;
    title: string;
    description: string;
    image_url1: string;
    image_url2: string;
    weight: string;
    price: number;
    in_stock: boolean;
    is_new: boolean;
    is_soon: boolean;
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
