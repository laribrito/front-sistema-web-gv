import React from "react"
import styles from "./navbar.module.css"

interface NavBarRootProps {
    children: React.ReactNode
}

export default function NavBarRoot({children}: NavBarRootProps){
    return (
        <nav className={styles.root}>
            {children}
        </nav>
    )
}