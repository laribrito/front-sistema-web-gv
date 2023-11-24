import React, { HtmlHTMLAttributes, ElementType } from "react"
import styles from "./header.module.css"

interface HeaderBtnExtraProps extends HtmlHTMLAttributes<HTMLButtonElement>{
    icon: ElementType
    fontSize?: string
}

export default function HeaderBtnExtra({icon: Icon, fontSize, ...rest}: HeaderBtnExtraProps){
    return (
        <button className={styles.btnExtra} {...rest}>
            <Icon fontSize={fontSize? fontSize : "1.7em"}/>
        </button>
    )
}