// app/auth/callback/route.ts
import { NextResponse }          from 'next/server';
import { supabaseServer }    from '@/lib/supabase-server'; // your @supabase/ssr helper

export async function GET(request: Request) {
    const url  = new URL(request.url);
    const code = url.searchParams.get('code');

    if (code) {
        const supabase = await supabaseServer();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) console.error('OAuth callback error', error);
    }

    // finally, send them home (or wherever)
    return NextResponse.redirect(new URL('/', url).toString());
}
