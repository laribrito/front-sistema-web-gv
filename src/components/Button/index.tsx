import React, {ButtonHTMLAttributes} from "react"
import styles from "./button.module.css"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    children: React.ReactNode
    width?: string
}

export default function Button({children, width, type, ...rest}:ButtonProps){
    return (
        <>
            <button className={`${styles.botao} ${type == 'submit'? styles.submit : ''}`} style={{width: width}} {...rest}>
                {children}
            </button>
        </>
    )
}