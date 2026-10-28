import {createClient} from '@supabase/supabase-js';

// Server-only client with the service-role key (bypasses RLS).
// Never import this from a client component.
export function supabaseAdmin() {
    if (typeof window !== 'undefined') {
        throw new Error('supabaseAdmin must not be used in the browser');
    }
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY; // no NEXT_PUBLIC_ prefix on purpose
    if (!url || !key) {
        throw new Error('Supabase admin client is not configured');
    }
    return createClient(url, key, {auth: {persistSession: false, autoRefreshToken: false}});
}
