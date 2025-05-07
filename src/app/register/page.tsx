'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './RegisterPage.module.css';

export default function RegisterPage() {
    const router = useRouter();
    const params = useSearchParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (params.get('access_token') || params.get('refresh_token')) {
            router.replace('/');
        }
    }, [params, router]);

    async function onEmailSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        const { error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { full_name: fullName } },
        });
        if (signUpError) return setError(signUpError.message);
        router.replace('/login?from=register');
    }

    async function onGoogle() {
        setError('');
        const { error: oauthError } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${location.origin}/register`,
            },
        });
        if (oauthError) setError(oauthError.message);
    }

    return (
        <div className="max-w-md mx-auto mt-20 space-y-6">
            <form onSubmit={onEmailSubmit} className={styles.form}>
                <h1>הרשמה</h1>

                <button
                    onClick={onGoogle}
                    type="button"
                    className={styles.button}
                >
                    המשך עם Google
                </button>

                <div className={styles.divider}>או:</div>

                <div className={styles.line}></div>

                <label>שם מלא</label>
                <input
                    placeholder="שם מלא"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    required
                    className={styles.input}
                />
                <label>כתובת מייל</label>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className={styles.input}
                />

                <label>בחר סיסמה</label>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    className={styles.input}
                />
                <button type="submit" className={styles.button}>
                    הרשמה
                </button>
            </form>

            {error && <p className="text-red-600 text-center">{error}</p>}

            <p className="text-center text-sm">
                כבר רשום?{' '}
                <a href="/login" className={styles.loginLink}>
                    היכנס כאן
                </a>
            </p>
        </div>
    );
}
