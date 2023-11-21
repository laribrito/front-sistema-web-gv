import React, {ButtonHTMLAttributes} from "react"
import styles from "./button.module.css"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
}

export default function Button({label, ...rest}:ButtonProps){
    return (
        <button className={styles.botao} {...rest}>
            {label}
        </button>
    )
}