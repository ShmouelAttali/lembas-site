// app/actions/signInWithGoogle.ts
import {headers} from 'next/headers'
import {redirect} from 'next/navigation'
import {supabaseServer} from '@/lib/supabase-server' // your SSR helper

export async function signInWithGoogle() {
    'use server'
    const origin = (await headers()).get('origin')!
    const supabase = await supabaseServer();

    const {data, error} = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {redirectTo: `${origin}/auth/callback`},
    })

    if (error) {
        console.error(error)
        redirect(`/login?error=${encodeURIComponent(error.message)}`)
    }

    // **THIS** is critical—send the browser on to Google:
    redirect(data.url)
}
