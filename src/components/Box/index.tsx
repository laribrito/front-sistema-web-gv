import React from "react"
import styles from "./box.module.css"

interface BoxProps {
    children?: React.ReactNode
    width: string
}

export default function Box({children, width}: BoxProps){
    return (
        <div className={styles.boxPadrao} style={{width: width}}>
            {children}
        </div>
    )
}