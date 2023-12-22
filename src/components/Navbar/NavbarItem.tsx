import React, { HtmlHTMLAttributes, ElementType } from "react"
import styles from "./navbar.module.css"
import { IconHome, IconHomeActive, IconNovoPedido, IconBusca, IconNovaCamisa, IconNovoEstilo } from "@/utils/elements"
import { useRouter } from "next/navigation"
import { useComponentsContext } from "@/context/componentsContext"

interface HeaderItemProps extends HtmlHTMLAttributes<HTMLButtonElement>{
    icon: ElementType
    fontSize?: string
    active?: boolean
    children: React.ReactNode
    idcamisa?: number
    submit?: boolean
    goto?: string | (() => void)
}

export default function HeaderItem({icon: Icon, goto, fontSize, active, children, submit=false, ...rest}: HeaderItemProps){
    const router = useRouter()
    const { setLoading } = useComponentsContext()
    return (
        <button 
            className={styles.item}
            onClick={()=>{
                setLoading(true)
                if(goto && typeof goto == 'string') router.push(goto)
                else if(goto && typeof goto == 'function') goto()
                else if(Icon==IconNovoPedido) router.push("/novo-pedido/")
                else if(Icon==IconHome) router.push("/home")
                else if(Icon==IconNovaCamisa) router.push("/camisa")
                else if(Icon==IconNovoEstilo) router.push(`/camisa/${rest['idcamisa']}/novo-estilo`)
                else if(Icon==IconBusca) console.log("Busca")
            }}
            type={submit? 'submit':'button'}
            {...rest}
        >
            <Icon fontSize={fontSize? fontSize : "1.7em"}/>
            <span className={active ? styles.btnAtivo : ''}>
                {children}
            </span>
        </button>
    )
}