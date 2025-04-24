// app/products/[slug]/page.tsx

import { supabaseServer } from '@/lib/supabase-server';
import Image from 'next/image';
import AddToCartButton from '@/components/AddToCartButton';

export default async function ProductPage({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const db = await supabaseServer();

  // 1) Fetch the product and its primary image
  const { data: [product], error } = await db
    .from('products')
    .select(`
      id,
      title,
      description,
      price,
      stock,
      product_images (
        image_url,
        is_primary
      )
    `)
    .eq('slug', slug)
    .limit(1);

  if (error || !product) {
    return <p>Product not found.</p>;
  }

  // 2) Pick the primary image (or fallback)
  const primaryImage = product.product_images.find(img => img.is_primary)?.image_url;

  return (
    <article className="max-w-3xl mx-auto space-y-6">
      {primaryImage && (
        <Image
          src={primaryImage}
          alt={product.title}
          width={800}
          height={500}
          className="rounded-lg"
        />
      )}

      <div>
        <h1 className="text-4xl font-bold">{product.title}</h1>
        <p className="mt-2 text-lg">{product.description}</p>
        <p className="mt-4 text-2xl font-semibold">${product.price.toFixed(2)}</p>
        <p className="mt-1 text-sm text-gray-500">
          {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
        </p>
      </div>

      <div>
        <AddToCartButton 
          product={{
            id: product.id,
            title: product.title,
            price: product.price,
          }} 
          disabled={product.stock === 0}
        />
      </div>
    </article>
  );
}
