'use client'
import { useAuth } from '@/context/authContext';
import styles from './main.module.css'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useComponentsContext } from '@/context/componentsContext';

export default function MainLayout({children}: { children: React.ReactNode}) {
    const router = useRouter()
    const { accessToken } = useAuth();
    const { setLoading } = useComponentsContext()

    //se não estiver logado, vai pra login
    useEffect(() => {
        if (!accessToken){
            setLoading(true)
            router.push('/');
        }
    }, [accessToken]);

    return (
        <main className={styles.main}>
            {children}
        </main>
    )
}
