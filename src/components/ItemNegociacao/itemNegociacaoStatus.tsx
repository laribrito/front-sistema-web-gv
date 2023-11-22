import React from "react"
import styles from "./itemNegociacao.module.css"
import { toUpperCase } from "@/utils/functions"


interface ItemNegociacaoStatusProps {
    value: "emAndamento" | "aprovado" | "cancelado"
}

export default function ItemNegociacaoStatus({value}: ItemNegociacaoStatusProps){
    return (
        <div className={`${styles.status} ${styles[value]}`}>
            {value=="emAndamento"? "Em Andamento" :toUpperCase(value)}
        </div>
    )
}