import React from "react"
import styles from "./header.module.css"

interface HeaderRootProps {
    children: React.ReactNode
}

export default function HeaderRoot({children}: HeaderRootProps){
    return (
        <header className={styles.root}>
            {children}
        </header>
    )
}