import React, { HtmlHTMLAttributes, ElementType } from "react"
import styles from "./navbar.module.css"
import { IconHome, IconHomeActive, IconNovoPedido, IconBusca, IconNovaCamisa, IconNovoEstilo } from "@/utils/elements"
import { useRouter } from "next/navigation"

interface HeaderItemProps extends HtmlHTMLAttributes<HTMLButtonElement>{
    icon: ElementType
    fontSize?: string
    active?: boolean
    children: React.ReactNode
    idcamisa?: number
}

export default function HeaderItem({icon: Icon, fontSize, active, children, ...rest}: HeaderItemProps){
    const router = useRouter()
    return (
        <button 
            className={styles.item}
            onClick={()=>{
                if(Icon==IconNovoPedido) router.push("/novo-pedido/")
                else if(Icon==IconHome) router.push("/home")
                else if(Icon==IconNovaCamisa) router.push("/nova-camisa")
                else if(Icon==IconNovoEstilo) router.push(`/nova-camisa/${rest['idcamisa']}/novo-estilo`)
                else if(Icon==IconBusca) console.log("Busca")
            }}
            {...rest}
        >
            <Icon fontSize={fontSize? fontSize : "1.7em"}/>
            <span className={active ? styles.btnAtivo : ''}>
                {children}
            </span>
        </button>
    )
}