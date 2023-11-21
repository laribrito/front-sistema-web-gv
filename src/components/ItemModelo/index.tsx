import React from "react"
import styles from "./itemModelo.module.css"
import Label from "@/components/Label"

interface ItemModeloProps {
    nomeModelo: string
    tipoCamisa: string
    qtdCamisas: number
    vertical?: boolean
} 

export default function ItemModelo({nomeModelo, tipoCamisa, qtdCamisas, vertical = false}: ItemModeloProps){
    const qtdExtenso = `${qtdCamisas} ${qtdCamisas === 1 ? "Unidade" : "Unidades"}`;

    return (
        <div className={vertical? styles.itemModeloVertical:styles.itemModeloPadrao}>
            <Label tipo="titulo3" valor={nomeModelo}/>
            <div className={vertical? styles.itemModeloInternoVertical:styles.itemModeloInterno}>
                <Label tipo="texto" valor={tipoCamisa} />
                <Label tipo="texto" valor={qtdExtenso}/>
            </div>
        </div>
    )
}