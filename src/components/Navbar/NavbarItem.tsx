import React, { HtmlHTMLAttributes, ElementType } from "react"
import styles from "./navbar.module.css"

interface HeaderBtnExtraProps extends HtmlHTMLAttributes<HTMLButtonElement>{
    icon: ElementType
    fontSize?: string
    children: React.ReactNode
}

export default function HeaderBtnExtra({icon: Icon, fontSize, children, ...rest}: HeaderBtnExtraProps){
    return (
        <button className={styles.item} {...rest}>
            <Icon fontSize={fontSize? fontSize : "1.7em"}/>
            <span>{children}</span>
        </button>
    )
}