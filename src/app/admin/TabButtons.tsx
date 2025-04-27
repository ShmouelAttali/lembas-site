// TabButtons.tsx
import React from 'react';

interface TabButtonsProps {
    tabs: string[];
    currentTab: string;
    onTabChange: (tab: string) => void;
}

const TabButtons = ({ tabs, currentTab, onTabChange }: TabButtonsProps) => (
    <div style={{ marginBottom: '1rem' }}>
        {tabs.map((tab) => (
            <button
                key={tab}
                onClick={() => onTabChange(tab)}
                style={{
                    marginRight: '0.5rem',
                    padding: '0.5rem 1rem',
                    borderRadius: '4px',
                    border: 'none',
                    background: tab === currentTab ? '#ec4899' : '#8b5cf6',
                    color: 'white',
                    cursor: 'pointer',
                }}
            >
                {tab.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </button>
        ))}
    </div>
);

export default TabButtons;
