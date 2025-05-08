'use client';
import React, {useState} from 'react';
import {supabase} from '@/lib/supabase';
import {useRouter} from 'next/navigation';
import styles from './LoginPage.module.css';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string>('');

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        const {error} = await supabase.auth.signUp({email, password});
        if (error) return setError(error.message);
        router.push('/');
    }

    async function onGoogle() {
        const {error} = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {redirectTo: `${location.origin}/auth/callback`},
        });
        if (error) setError(error.message);
    }

    return (
        <form onSubmit={onSubmit} className={styles.form}>
            <h1>התחברות למערכת</h1>
            <button type="button" onClick={onGoogle} className={styles.button}>
                להתחברות עם חשבון גוגל
            </button>
            <div className={styles.line}></div>
            <label>אימייל:</label>
            <input type="email" required placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                   className={styles.input}/>
            <label>סיסמה:</label>
            <input type="password" required placeholder="Password" value={password}
                   onChange={e => setPassword(e.target.value)} className={styles.input}/>

            <button type="submit" className={styles.button}>התחבר</button>

            {error && <p className="text-red-600">{error}</p>}
            <div className={styles.line}></div>
            <p>
                אין לך חשבון? <a href="/register" className={styles.register}>הרשם כאן</a>
            </p>
        </form>
    );
}
