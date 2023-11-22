import React from "react"
import styles from "./itemAndDescription.module.css"
import Label from "@/components/Label"

interface ItemAndDescriptionProps {
    item: string
    description: string
    horizontal?: boolean
}

export default function ItemAndDescription({item, description, horizontal=false}: ItemAndDescriptionProps){
    return (
        <div className={`${styles.idGeral} ${horizontal ? styles.itemAndDescriptionH : styles.itemAndDescription}`}>
            <Label tipo="titulo3" valor={`${item}:`}/>
            <Label tipo="texto" valor={description}/>
        </div>
    )
}