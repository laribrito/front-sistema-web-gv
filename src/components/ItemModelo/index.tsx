import React from "react"
import styles from "./itemModelo.module.css"

interface ItemModeloProps {
    nomeModelo: string
    tipoCamisa: string
    qtdCamisas: number
    vertical?: boolean
} 

export default function ItemModelo({nomeModelo, tipoCamisa, qtdCamisas, vertical = false}: ItemModeloProps){
    return (
        <div className={vertical? styles.itemModeloVertical:styles.itemModeloPadrao}>
            <p className={styles.titulo}>{nomeModelo}</p>
            <div className={vertical? styles.itemModeloInternoVertical:styles.itemModeloInterno}>
                <p>{tipoCamisa}</p>
                <p>{qtdCamisas} {qtdCamisas==1? "Unidade": "Unidades"}</p>
            </div>
        </div>
    )
}