'use client';

import {useCart} from "@/contexts/CartContext";
import {Product} from "@/components/ProductList";
import {useEffect} from "react";
import {ProductImage} from "./ProductImage";

export default function ProductThumb({product}: { product: Product }) {
    const {addItem} = useCart();

    useEffect(() => {
        // Kick off a background load of the alternate image
        const img = new window.Image()
        img.src = product.image_url2
    }, [product.image_url2])

    return (
        <div key={product.id} className={`product-card ${!product.in_stock ? 'out-of-stock' : ''}`}>
                <ProductImage product={product}/>
                <div className="product-info">
                    <h3>{product.title}</h3>
                    <p>{product.description}</p>
                    <p>{product.weight + ' גרם'}</p>
                    <p>{'₪' + product.price}</p>
                    <button type={"button"}
                            className={`add-to-cart ${!product.in_stock ? 'disabled' : ''}`}
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
