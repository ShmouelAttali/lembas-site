'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

type GlobalLoaderContextType = {
    loading: boolean;
    setLoading: (loading: boolean) => void;
};

const GlobalLoaderContext = createContext<GlobalLoaderContextType>({
    loading: false,
    setLoading: () => {},
});

export const useGlobalLoader = () => useContext(GlobalLoaderContext);

export function GlobalLoaderProvider({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();

    // Route change loader
    useEffect(() => {
        if (!pathname) return;
        setLoading(true);
        const timeout = setTimeout(() => setLoading(false), 500); // simulate loading
        return () => clearTimeout(timeout);
    }, [pathname]);

    return (
        <GlobalLoaderContext.Provider value={{ loading, setLoading }}>
            {loading && (
                <div className="global-loader-overlay">
                    <div className="global-loader-spinner"></div>
                </div>
            )}
            {children}
        </GlobalLoaderContext.Provider>
    );
}
