import React from 'react';
import styles from "./EmptyCartMessage.module.css";

export function EmptyCartMessage() {
    return (
        <div className={styles.EmptyCartMessage}>
            <h1>העגלה ריקה</h1>
            <p>
                אין פריטים לתשלום.{' '}
            </p>
        </div>
    );
}
