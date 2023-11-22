import React from "react"
import styles from "./itemNegociacao.module.css"
import Box from "@/components/Box"
import config from "@/utils/config"
import Label from "@/components/Label"
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
                    <Label tipo="titulo3" valor={nomeNegociacao}/>
                
                    <Label tipo="texto" valor={nomeCliente}/>
                </div>

                <div className={styles.itemNegociacaoDireita}>
                    {children}
                    
                    <Label tipo="texto" valor={qtdExtenso}/>
                </div>
            </div>
        </Box>
    )
}