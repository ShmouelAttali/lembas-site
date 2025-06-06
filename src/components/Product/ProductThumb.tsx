'use client';

import {useCart} from "@/contexts/CartContext";
import {useEffect} from "react";
import {ProductImage} from "./ProductImage";
import styles from "./ProductThumb.module.css";
import {Product} from "@/components/Product/ProductList";

export default function ProductThumb({product}: { product: Product }) {
    const {addItem} = useCart();

    useEffect(() => {
        const img = new window.Image();
        img.src = product.image_url2;
    }, [product.image_url2]);

    return (
        <div
            key={product.id}
            className={`${styles.productCard} ${!product.in_stock ? styles.outOfStock : ''}`}
        >
            <ProductImage product={product}/>
            <div className={styles.productInfo}>
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <p>{'כ-' +product.weight + ' גרם'}</p>
                <p>{'₪' + product.price}</p>
                <button
                    type="button"
                    className={`${styles.addToCart} ${!product.in_stock ? styles.addToCartDisabled : ''}`}
                    onClick={() =>
                        addItem({id: product.id, title: product.title, price: product.price})
                    }
                >
                    הוסף לסל
                </button>
            </div>
        </div>
    );
}
