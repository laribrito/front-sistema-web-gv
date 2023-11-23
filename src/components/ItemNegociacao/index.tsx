import React from "react"
import styles from "./itemNegociacao.module.css"
import Box from "@/components/Box"
import config from "@/utils/config"
import { QtdUnidadesPorExtenso } from "@/utils/functions"


interface ItemNegociacaoProps {
    nomeNegociacao: string
    nomeCliente: string
    qtdCamisas: number
    children: React.ReactNode
}

export default function ItemNegociacao({nomeNegociacao, nomeCliente, qtdCamisas, children}: ItemNegociacaoProps){
    const qtdExtenso = QtdUnidadesPorExtenso(qtdCamisas);
    
    return (
        <Box width={config.WIDTH_WIDGETS}>
            <div className={styles.itemNegociacao}>
                <div className={styles.itemNegociacaoEsquerda}>
                    <h3>{nomeNegociacao}</h3>
                
                    <p>{nomeCliente}</p>
                </div>

                <div className={styles.itemNegociacaoDireita}>
                    {children}
                    
                    <p>{qtdExtenso}</p>
                </div>
            </div>
        </Box>
    )
}