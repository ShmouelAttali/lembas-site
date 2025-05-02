'use client';

import {useCart} from "@/contexts/CartContext";
import {Product} from "@/components/ProductList";
import {useState} from "react";
import Image from "next/image";

export default function ProductThumb({product}: { product: Product }) {
    const {addItem} = useCart();
    const [swapped, setSwapped] = useState(false);

    return (
        <div key={product.id} className="product-card">
            <Image src={swapped ? product.image_url2 : product.image_url1} alt={product.title}
                   sizes="(max-width: 768px) 100vw, 50vw"
                   className="product-thumb"
                   onMouseEnter={() => setSwapped(true)}
                   onMouseLeave={() => setSwapped(false)}
                   onClick={() => setSwapped(prevState => !prevState)}/>
            <div className="product-info">
                <h3>{product.title}</h3>
                <p>{product.description}</p>
                <p>{product.weight + ' גרם'}</p>
                <p>{'₪' + product.price}</p>
                <button type={"button"}
                        className="add-to-cart"
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
