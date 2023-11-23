import React, { HTMLProps } from "react"
import styles from "./label.module.css"

export interface labelProps extends HTMLProps<HTMLLabelElement> {
    tipo: "titulo1" | "titulo2" | "titulo3" | "label" | "texto" | "label discreto"
    valor: string
} 

export default function Label({tipo, valor, style, ...rest}: labelProps){
    function labelConstr(styleClass: string){
        if (styleClass == styles.label){
            return (<label className={styleClass} {...rest}>{valor}</label>)
        }

        if (styleClass == styles.titulo1){
            return (<h1 className={styleClass}>{valor}</h1>)
        }

        if (styleClass == styles.titulo2){
            return (<h2 className={styleClass}>{valor}</h2>)
        }

        if (styleClass == styles.titulo3){
            return (<h3 className={styleClass}>{valor}</h3>)
        }

        return (<p className={styleClass}>{valor}</p>)
    }

    return (
        <>
            {tipo=="titulo1" && labelConstr(styles.titulo1)}
            {tipo=="titulo2" && labelConstr(styles.titulo2)}
            {tipo=="titulo3" && labelConstr(styles.titulo3)}
            {tipo=="label" && labelConstr(styles.label)}
            {tipo=="texto" && labelConstr(styles.texto)}
            {tipo=="label discreto" && labelConstr(styles.labelDiscreto)}
        </>
    )
}