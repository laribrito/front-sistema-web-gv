import React from "react"
import styles from "./itemNegociacao.module.css"
import { toUpperCase } from "@/utils/functions"


interface ItemNegociacaoStatusProps {
    value: string | undefined | number
}

export default function ItemNegociacaoStatus({value}: ItemNegociacaoStatusProps){
    const valor = String(value) ?? '';
    const newValue = (valor=="Em Andamento")? "emAndamento" : valor
    return (
        <div className={`${styles.status} ${styles[newValue]}`}>
            {toUpperCase(valor)}
        </div>
    )
}