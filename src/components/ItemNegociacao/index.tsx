import React from "react"
import styles from "./itemNegociacao.module.css"
import Box from "@/components/Box"
import config from "@/utils/config"
import { QtdUnidadesPorExtenso } from "@/utils/functions"

export type DataItemNegotiation = {
    negotiation_id: number
    name: string
    customer_name: string
    total_number_units: number
    status?: string | number
}

interface ItemNegociacaoProps extends React.HTMLProps<HTMLDivElement> {
    children: React.ReactNode
    customer_name: string
    total_number_units: number
    status?: string | number
}

export default function ItemNegociacao({name, customer_name, total_number_units, children, ...rest}: ItemNegociacaoProps){
    const qtdExtenso = QtdUnidadesPorExtenso(total_number_units);
    
    return (
        <Box fixWidth={config.WIDTH_WIDGETS} {...rest} >
            <div className={styles.itemNegociacao}>
                <div className={styles.itemNegociacaoEsquerda}>
                    <h3>{name}</h3>
                
                    <p>{customer_name}</p>
                </div>

                <div className={styles.itemNegociacaoDireita}>
                    {children}
                    
                    <p>{qtdExtenso}</p>
                </div>
            </div>
        </Box>
    )
}