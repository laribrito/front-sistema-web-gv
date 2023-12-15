'use client'
import { useAuth } from '@/context/authContext';
import styles from './main.module.css'
import { useEffect } from 'react';

export default function MainLayout({children}: { children: React.ReactNode}) {
    const { accessToken } = useAuth();

    //se não estiver logado, vai pra login
    useEffect(() => {
        if (!accessToken) window.location.href = '/';
    }, [accessToken]);

    return (
        <main className={styles.main}>
            {children}
        </main>
    )
}
