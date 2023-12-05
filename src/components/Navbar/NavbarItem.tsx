import React, { HtmlHTMLAttributes, ElementType } from "react"
import styles from "./navbar.module.css"

interface HeaderItemProps extends HtmlHTMLAttributes<HTMLButtonElement>{
    icon: ElementType
    fontSize?: string
    children: React.ReactNode
}

export default function HeaderItem({icon: Icon, fontSize, children, ...rest}: HeaderItemProps){
    return (
        <button className={styles.item} {...rest}>
            <Icon fontSize={fontSize? fontSize : "1.7em"}/>
            <span>{children}</span>
        </button>
    )
}