import React, {ButtonHTMLAttributes} from "react"
import styles from "./button.module.css"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    children: React.ReactNode
}

export default function Button({children, ...rest}:ButtonProps){
    return (
        <button className={styles.botao} {...rest}>
            {children}
        </button>
    )
}