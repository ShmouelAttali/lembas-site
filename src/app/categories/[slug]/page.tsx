// app/categories/[slug]/page.tsx

import { supabaseServer } from '@/lib/supabase-server';
import Link from 'next/link';

export default async function CategoryPage({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const db = await supabaseServer();

  // 1) Load the category
  const { data: categories } = await db
    .from('categories')
    .select('id, name')
    .eq('slug', slug)
    .limit(1);

  const category = categories?.[0];
  if (!category) {
    return <p>Category not found.</p>;
  }

  // 2) Load products in this category
  const { data: products } = await db
    .from('products')
    .select('id, title, slug, price, stock')
    .eq('category_id', category.id)
    .order('title');

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">{category.name}</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products?.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.slug}`}
            className="block p-6 rounded-2xl
    bg-surface hover:bg-primary/80
    transition
    border-2 border-primary/50"
          >
            <h2 className="text-xl font-semibold text-white">{p.title}</h2>
            <p className="mt-1 text-lg">${p.price.toFixed(2)}</p>
            <p className="mt-1 text-sm text-gray-500">
              {p.stock} in stock
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
