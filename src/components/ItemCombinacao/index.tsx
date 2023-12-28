import React, { ReactNode } from "react"
import styles from "./itemCombinacao.module.css"
import Box from "@/components/Box"
import config from "@/utils/config"
import { QtdUnidadesPorExtenso } from "@/utils/functions"
import { useRouter } from "next/navigation"
import { useComponentsContext } from "@/context/componentsContext"

interface itemCombinacaoProps {
    cor: string
    malha: string
    qtdCamisas: number
    url: string
    children?: ReactNode
} 

export default function ItemCombinacao({cor, malha, qtdCamisas, url, children}: itemCombinacaoProps){
    const qtdExtenso = QtdUnidadesPorExtenso(qtdCamisas);
    const router = useRouter()
    const { setLoading } = useComponentsContext()
    return (
        <Box width={config.WIDTH_WIDGETS}>
            <div className={styles.itemCombinacao}  onClick={()=>{
                setLoading(true)
                router.push(url)
            }}>
                <div className={styles.itemCombinacaoEsquerda}>
                    <div className={styles.textBox}>
                        <h3>Malha:</h3>
                        <p>{malha}</p>
                    </div>

                    <div className={styles.textBox}>
                        <h3>Cor:</h3>
                        <p>{cor}</p>
                    </div>
                </div>

                <div className={styles.itemCombinacaoDireita}>
                    <p>{qtdExtenso}</p>

                    <div className={styles.indicators}>
                        {children}
                    </div>
                </div>
                
            </div>
        </Box>
    )
}