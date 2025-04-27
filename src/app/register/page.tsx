// src/app/register/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import { User as UserIcon, ArrowRightCircle } from 'lucide-react';

export default function RegisterPage() {
    const router   = useRouter();
    const params   = useSearchParams();
    const [email, setEmail]       = useState('');
    const [password, setPassword]   = useState('');
    const [fullName, setFullName]   = useState('');
    const [error, setError]       = useState<string>('');

    // 1) Handle Google callback: after OAuth, Supabase will redirect you back
    //    with a ?access_token=… in the URL. We can detect that and redirect home.
    useEffect(() => {
        if (params.get('access_token') || params.get('refresh_token')) {
            // user is now signed in
            router.replace('/');
        }
    }, [params, router]);

    // 2) Email/password flow
    async function onEmailSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } },
        });
        if (signUpError) return setError(signUpError.message);
        // optionally upsert into `profile` here
        router.replace('/login?from=register');
    }

    // 3) Google OAuth flow
    async function onGoogle() {
        setError('');
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // Supabase will bring you back to /register?access_token=…
                redirectTo: `${location.origin}/register`,
            },
        });
        if (oauthError) setError(oauthError.message);
    }

    return (
        <div className="max-w-md mx-auto mt-20 space-y-6">
            <h2 className="text-2xl font-bold text-center">הרשמה</h2>

            <button
                onClick={onGoogle}
                className="w-full btn-secondary flex items-center justify-center gap-2"
            >
                <UserIcon size={20} /> המשך עם Google
            </button>

            <div className="divider">או</div>

            <form onSubmit={onEmailSubmit} className="space-y-4">
                <input
                    placeholder="שם מלא"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    className="input"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className="input"
                />
                <button type="submit" className="w-full btn-primary flex items-center justify-center gap-2">
                    הרשמה <ArrowRightCircle size={20} />
                </button>
            </form>

            {error && <p className="text-red-600 text-center">{error}</p>}

            <p className="text-center text-sm">
                כבר רשום?{' '}
                <a href="/login" className="text-blue-500 underline">
                    היכנס כאן
                </a>
            </p>
        </div>
    );
}
