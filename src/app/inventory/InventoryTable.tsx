"use client";

import {useEffect, useState} from "react";
import {supabase} from "@/lib/supabase";
import styles from "./Inventory.module.css";

// Local type override to match actual shape returned by Supabase
export interface InventoryWithIngredient {
    ingredient_id: string;
    amount: number;
    ingredients: {
        name: string;
        low_stock_threshold: number;
    };
}

export default function InventoryTable() {
    const [inventory, setInventory] = useState<InventoryWithIngredient[]>([]);

    const fetchInventory = async () => {
        const {data, error} = await supabase
            .from("ingredients_inventory")
            .select("ingredient_id, amount, ingredients(name, low_stock_threshold)");
        const filtered = (data as unknown as InventoryWithIngredient[] ?? []).filter(
            item => item.ingredients.low_stock_threshold >= 0
        );
        if (error) return console.error("Error loading inventory:", error);

        const sorted = (filtered).sort((a, b) =>
            a.ingredients.name.localeCompare(b.ingredients.name)
        );

        setInventory(sorted);
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    const updateAmount = async (ingredient_id: string, newAmount: number) => {
        setInventory(prev =>
            prev.map(i =>
                i.ingredient_id === ingredient_id ? {...i, amount: newAmount} : i
            )
        );

        const {error} = await supabase.from("ingredients_inventory").upsert({
            ingredient_id,
            amount: newAmount
        });

        if (error) console.error("Error updating amount:", error);
    };

    return (
        <div className={styles.inventoryTable}>
            <h2>מצאי חומרים</h2>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>חומר</th>
                    <th>כמות במצאי (גרם)</th>
                    <th>סף התראה</th>
                </tr>
                </thead>
                <tbody>
                {inventory.map((row) => {
                    const belowThreshold = row.amount < row.ingredients.low_stock_threshold;
                    return (
                        <tr key={row.ingredient_id} className={belowThreshold ? styles.alert : ""}>
                            <td>{row.ingredients.name}</td>
                            <td>
                                <input
                                    type="number"
                                    defaultValue={row.amount}
                                    onFocus={(e) => {
                                        e.target.value = ""; // clears field
                                    }}
                                    onBlur={(e) => {
                                        const value = e.target.value;
                                        const parsed = Number(value);

                                        if (value === "" || isNaN(parsed)) {
                                            e.target.value = row.amount.toString(); // revert
                                        } else {
                                            updateAmount(row.ingredient_id, parsed);
                                        }
                                    }}
                                />

                            </td>
                            <td>{row.ingredients.low_stock_threshold ?? "-"}</td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
}
