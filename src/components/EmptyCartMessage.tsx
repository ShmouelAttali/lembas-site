import React from 'react';

export function EmptyCartMessage() {
    return (
        <div className="container" style={{ padding: '2rem 0' }}>
            <h1>העגלה ריקה</h1>
            <p>
                אין פריטים לתשלום.{' '}
            </p>
        </div>
    );
}
