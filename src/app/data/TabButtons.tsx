// TabButtons.tsx
import React from 'react';
import styles from "./TabButtons.module.css";

interface TabButtonsProps {
    tabs: string[];
    currentTab: string;
    onTabChange: (tab: string) => void;
}

const TabButtons = ({tabs, currentTab, onTabChange}: TabButtonsProps) => (
    <div className={styles.TabButtons_11}>
        {tabs.map((tab) => (
            <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={styles.TabButtons_16 + (currentTab === tab ? ` ${styles.selected}` : '')}
            >
                {tab.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
        ))}
    </div>
);

export default TabButtons;
