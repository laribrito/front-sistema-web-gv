import React, {ButtonHTMLAttributes} from "react"
import styles from "./button.module.css"

export default function Button({...rest}:ButtonHTMLAttributes<HTMLButtonElement>){
    return (
        <button className={styles.botao} {...rest}>
            {rest.value}
        </button>
    )
}