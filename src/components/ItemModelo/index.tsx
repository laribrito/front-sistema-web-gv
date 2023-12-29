import React from "react"
import styles from "./itemModelo.module.css"
import Box from "@/components/Box"
import config from "@/utils/config"
import { QtdUnidadesPorExtenso } from "@/utils/functions"
import { useRouter } from "next/navigation"
import { useComponentsContext } from "@/context/componentsContext"

interface ItemModeloProps {
    nomeModelo: string
    tipoCamisa: string
    qtdCamisas: number
    url: string
    vertical?: boolean
} 

export default function ItemModelo({nomeModelo, tipoCamisa, url, qtdCamisas, vertical = false}: ItemModeloProps){
    const qtdExtenso = QtdUnidadesPorExtenso(qtdCamisas);
    const router = useRouter()
    const { setLoading } = useComponentsContext()
    return (
        <Box fixWidth={vertical ? config.WIDTH_HALF_WIDGETS : config.WIDTH_WIDGETS}>
            <div className={styles.itemModelo} onClick={()=>{
                setLoading(true)
                router.push(url)
            }}>
                <h3>{nomeModelo}</h3>
                <div className={vertical ? styles.itemModeloInternoVertical : styles.itemModeloInterno}>
                <p>{tipoCamisa} </p>
                <p>{qtdExtenso} </p>
                </div>
            </div>
        </Box>
    )
}