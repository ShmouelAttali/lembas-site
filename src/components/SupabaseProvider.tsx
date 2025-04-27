'use client';

import { useState } from 'react';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import {supabase} from "@/lib/supabase";

export default function SupabaseProvider({ children }: { children: React.ReactNode }) {
    // initialize once, on the client
    const [supabaseClient] = useState(
        () => supabase
    );

    return (
        <SessionContextProvider supabaseClient={supabaseClient}>
            {children}
        </SessionContextProvider>
    );
}
