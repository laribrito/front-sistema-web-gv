import React, { ReactNode } from "react"
import styles from "./itemCombinacao.module.css"
import Label from "@/components/Label"
import Box from "@/components/Box"
import config from "@/utils/config"
import QtdUnidadesPorExtenso from "@/utils/functions"

interface itemCombinacaoProps {
    cor: string
    malha: string
    qtdCamisas: number
    children?: ReactNode
} 

export default function ItemCombinacao({cor, malha, qtdCamisas, children}: itemCombinacaoProps){
    const qtdExtenso = QtdUnidadesPorExtenso(qtdCamisas);

    return (
        <Box width={config.WIDTH_WIDGETS}>
            <div className={styles.itemCombinacao}>
                <div className={styles.itemCombinacaoEsquerda}>
                    <div className={styles.textBox}>
                        <Label tipo="titulo3" valor="Cor:"/>
                        <Label tipo="texto" valor={cor}/>
                    </div>

                    <div className={styles.textBox}>
                        <Label tipo="titulo3" valor="Malha:"/>
                        <Label tipo="texto" valor={malha}/>
                    </div>
                </div>

                <div className={styles.itemCombinacaoDireita}>
                    <Label tipo="texto" valor={qtdExtenso}/>

                    <div className={styles.indicators}>
                        {children}
                    </div>
                </div>
                
            </div>
        </Box>
    )
}