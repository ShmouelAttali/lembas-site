'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const router   = useRouter();
    const [email, setEmail]     = useState('');
    const [password, setPassword] = useState('');
    const [error, setError]     = useState<string>('');

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return setError(error.message);
        router.push('/');
    }

    async function onGoogle() {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${location.origin}/auth/callback` },
        });
        if (error) setError(error.message);
    }

    return (
        <form onSubmit={onSubmit} className="max-w-sm mx-auto mt-20 flex flex-col gap-4">
            <input type="email"    required placeholder="Email"    value={email}    onChange={e => setEmail(e.target.value)}    className="input" />
            <input type="password" required placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="input" />
            <button type="submit" className="btn-primary">Sign In</button>
            <button type="button" onClick={onGoogle} className="btn-secondary">
                Continue with Google
            </button>
            {error && <p className="text-red-600">{error}</p>}
            <p>
                Don’t have an account? <a href="/register" className="text-blue-500">Register here</a>
            </p>
        </form>
    );
}
