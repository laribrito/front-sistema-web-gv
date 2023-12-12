'use client'
import styles from './main.module.css'

export default function MainLayout({children}: { children: React.ReactNode}) {
    return (
        <main className={styles.main}>
            {children}
        </main>
    )
}
