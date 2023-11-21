import React, { HtmlHTMLAttributes } from "react"
import styles from "./label.module.css"

interface labelProps {
    tipo: "titulo1" | "titulo2" | "titulo3" | "label" | "texto" | "label discreto"
    valor: string
} 

export default function Label({tipo, valor}: labelProps){
    function labelConstr(valor: string, styleClass: string){
        return (
            <p className={styleClass}>
                {valor}
            </p>
        )
    }

    return (
        <>
            {tipo=="titulo1" && labelConstr(valor, styles.titulo1)}
            {tipo=="titulo2" && labelConstr(valor, styles.titulo2)}
            {tipo=="titulo3" && labelConstr(valor, styles.titulo3)}
            {tipo=="label" && labelConstr(valor, styles.label)}
            {tipo=="texto" && labelConstr(valor, styles.texto)}
            {tipo=="label discreto" && labelConstr(valor, styles.labelDiscreto)}
        </>
    )
}