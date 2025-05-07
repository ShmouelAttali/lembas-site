'use client'
import React, {useEffect, useState} from 'react'
import {supabase} from '@/lib/supabase'
import styles from './RecipesPage.module.css'

type Product = {
    id: string
    title: string
    weight: number
}


export default function RecipesPage() {
    const [products, setProducts] = useState<Product[]>([])
    const [selected, setSelected] = useState<Product | null>(null)
    const [ingredients, setIngredients] = useState<Ingredient[]>([])
    const [numLoaves, setNumLoaves] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)

    // Fetch products on mount
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const {data, error} = await supabase
                    .from<'products', Product>('products')
                    .select('id, title, weight')
                    .order('title')
                if (error) throw error
                setProducts(data || [])
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])


    // Fetch ingredients when a product is selected
    type Ingredient = {
        weight: number
        ingredient: {
            name: string
            price_per_100g: number
        }
    }

    useEffect(() => {
        if (!selected) return

        const fetchIngredients = async () => {
            setLoading(true)
            try {
                const {data, error} = await supabase
                    .from('product_ingredients')
                    .select('weight, ingredient:ingredients(name, price_per_100g)')
                    .eq('product_id', selected.id)

                if (error) throw error

                // coerce data into our Ingredient[] shape
                const normalized: Ingredient[] = (data as any[]).map((row) => {
                    // `row.ingredient` might already be the object you want…
                    let ing = row.ingredient
                    // …or it might (in other cases) come back as an array
                    if (Array.isArray(ing)) {
                        ing = ing[0]
                    }
                    if (!ing) {
                        console.warn('missing ingredient for row', row)
                        return {
                            weight: row.weight,
                            ingredient: {name: '–', price_per_100g: 0},
                        }
                    }
                    return {
                        weight: row.weight,
                        ingredient: ing,
                    }
                })

                setIngredients(normalized)
            } catch (err: any) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchIngredients()
    }, [selected])

    // compute raw and cost
    const rawWeight = ingredients.reduce((sum, i) => sum + i.weight, 0)
    const costPerLoaf = ingredients.reduce(
        (sum, {ingredient, weight}) => sum + (ingredient.price_per_100g * weight) / 100,
        0
    )

    return (
        <div className={styles.container}>
            <aside className={styles.rightPane}>
                {loading && <p>טוען…</p>}
                {error && <p className={styles.error}>{error}</p>}
                <ul className={styles.productList}>
                    {products.map((p) => (
                        <li
                            key={p.id}
                            className={styles.productItem + (selected?.id === p.id ? ' ' + styles.selected : '')}
                            onClick={() => {
                                setError(null)
                                setIngredients([])
                                setSelected(p)
                                setNumLoaves(1)
                            }}
                        >
                            {p.title}
                        </li>
                    ))}
                </ul>
            </aside>

            <main className={styles.leftPane}>
                {selected ? (
                    <>
                        <h1>
                            מתכון ל{selected.title} ({rawWeight} גרם, {selected.weight} גרם אחרי אפיה)
                        </h1>

                        <label>
                            מספר הלחמים:&nbsp;
                            <input
                                type="number"
                                min={1}
                                value={numLoaves}
                                onChange={(e) => setNumLoaves(Math.max(1, +e.target.value))}
                            />
                        </label>

                        <table className={styles.ingredientsTable}>
                            <thead>
                            <tr className={styles.ingredientItem}>
                                <th></th>
                                <th>מרכיב</th>
                                <th>גרם (ל-{numLoaves})</th>
                                <th>עלות ליחידה (₪)</th>
                            </tr>
                            </thead>
                            <tbody>
                            {ingredients.map(({ingredient, weight}) => {
                                const totalGrams = weight * numLoaves
                                const cost = (ingredient.price_per_100g * weight) / 100
                                return (
                                    <tr key={ingredient.name}>
                                        <td><input type="checkbox"/></td>
                                        <td>{ingredient.name}</td>
                                        <td>{totalGrams}</td>
                                        <td>{cost.toFixed(2)}</td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>

                        <p className={styles.totalCost}>
                            עלות כוללת ללחם אחד: ₪{costPerLoaf.toFixed(2)}
                        </p>
                    </>
                ) : (
                    <p>בחר מוצר כדי לראות מתכון</p>
                )}
            </main>
        </div>
    )
}
