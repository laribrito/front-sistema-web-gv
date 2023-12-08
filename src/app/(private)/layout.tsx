'use client'
import LoadingScreen from '@/components/LoadingScreen'
import styles from './main.module.css'
import { useState } from 'react'

export default function MainLayout({children}: { children: React.ReactNode}) {
     const [isLoading, setLoading] = useState(false)
    return (
        <main className={styles.main}>
            {children}
            {isLoading && <LoadingScreen/>}
        </main>
    )
}
