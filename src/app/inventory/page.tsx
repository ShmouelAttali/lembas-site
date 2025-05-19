"use client";

import {useState} from "react";
import InventoryTable from "./InventoryTable";
import OrderSummary from "./OrderSummary";
import DeductionModal from "./DeductionModal";
import styles from "./Inventory.module.css";

export default function InventoryPage() {
    const [deductItems, setDeductItems] = useState<any[] | null>(null);
    const [inventoryKey, setInventoryKey] = useState(0);
    const refreshInventory = () => setInventoryKey(k => k + 1);


    return (
        <div className={styles.wrapper}>
            <h1>ניהול מצאי</h1>

            <InventoryTable key={inventoryKey}/>
            <hr/>
            <OrderSummary onPrepareDeduction={setDeductItems}/>
            {deductItems && (
                <DeductionModal
                    items={deductItems}
                    onCloseAction={() => {
                        setDeductItems(null);
                        refreshInventory();
                    }
                    }
                />
            )}
        </div>
    );
}