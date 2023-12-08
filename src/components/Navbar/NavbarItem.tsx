import React, { HtmlHTMLAttributes, ElementType } from "react"
import styles from "./navbar.module.css"
import { IconHome, IconHomeActive, IconNovoPedido, IconBusca } from "@/utils/elements"

interface HeaderItemProps extends HtmlHTMLAttributes<HTMLButtonElement>{
    icon: ElementType
    fontSize?: string
    children: React.ReactNode
}

export default function HeaderItem({icon: Icon, fontSize, children, ...rest}: HeaderItemProps){
    return (
        <button 
            className={styles.item}
            onClick={()=>{
                if(Icon==IconNovoPedido) window.location.href="/novo-pedido/"
                else if(Icon==IconHome) window.location.href="/home"
                else if(Icon==IconBusca) console.log("Busca")
            }}
            {...rest}
        >
            <Icon fontSize={fontSize? fontSize : "1.7em"}/>
            <span>{children}</span>
        </button>
    )
}