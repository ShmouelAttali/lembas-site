"use client";

import {useState} from "react";
import {supabase} from "@/lib/supabase";
import styles from "./Inventory.module.css";
import {inventoryAlertTemplate} from "@/lib/telegram-templates";
import {sendTelegramMessage} from "@/lib/utils";
import {InventoryWithIngredient} from "@/app/inventory/InventoryTable";

export default function DeductionModal({items, onCloseAction}: { items: any[], onCloseAction: () => void }) {
    const [adjustments, setAdjustments] = useState(() => {
            return items.map(item => ({...item, adjust: item.required}));
        }
    );
    const [saving, setSaving] = useState(false);

    const handleChange = (id: string, value: number) => {
        setAdjustments(prev =>
            prev.map(i =>
                i.ingredient_id === id ? {...i, adjust: value} : i
            )
        );
    };

    const handleConfirm = async () => {
        setSaving(true);
        const updates = adjustments.map(a => ({
            ingredient_id: a.ingredient_id,
            amount: a.amount - a.adjust > 0 ? a.amount - a.adjust : 0,
        }));

        const {error} = await supabase.from("ingredients_inventory").upsert(updates);
        if (error) console.error("Error applying deduction:", error);

        const {data: refreshed} = await supabase
            .from("ingredients_inventory")
            .select("ingredient_id, amount, ingredients(name, low_stock_threshold)")
            .in("ingredient_id", updates.map(u => u.ingredient_id));
        if (refreshed) {

            const alerts = (refreshed as unknown as InventoryWithIngredient[]).filter(i => i.amount < i.ingredients.low_stock_threshold).map(i => {
                return {
                    name: i.ingredients.name,
                    remaining: i.amount,
                    threshold: i.ingredients.low_stock_threshold
                };
            });
            console.log(alerts, refreshed);
            if (alerts.length > 0) {
                await sendTelegramMessage(inventoryAlertTemplate(alerts));
            }
        }

        setSaving(false);
        onCloseAction();
    };

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modal}>
                <h3>אתה עומד להסיר את החומרים הבאים:</h3>

                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>חומר</th>
                        <th>כמות נוכחית</th>
                        <th>כמות להסרה</th>
                    </tr>
                    </thead>
                    <tbody>
                    {adjustments.map((item) => (
                        <tr key={item.ingredient_id}>
                            <td>{item.name ?? ""}</td>
                            <td>{item.amount ?? "-"}</td>
                            <td>
                                <input
                                    type="number"
                                    min={0}
                                    max={item.amount}
                                    value={item.adjust}
                                    onChange={(e) => handleChange(item.ingredient_id, Number(e.target.value))}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className={styles.modalActions}>
                    <button onClick={onCloseAction} disabled={saving}>ביטול</button>
                    <button onClick={handleConfirm} disabled={saving}>אישור הסרה</button>
                </div>
            </div>
        </div>
    );
}
