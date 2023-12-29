import React from "react"
import styles from "./box.module.css"

interface BoxProps extends React.HTMLProps<HTMLDivElement> {
    children?: React.ReactNode
    fixWidth?: string
}

export default function Box({children, fixWidth, ...rest}: BoxProps){
    return (
        <div className={styles.boxPadrao} style={{width: fixWidth}} {...rest}>
            {children}
        </div>
    )
}