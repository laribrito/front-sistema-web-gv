import React from "react"
import styles from "./itemAndDescription.module.css"

interface ItemAndDescriptionProps {
    item: string
    description: string
    horizontal?: boolean
}

export default function ItemAndDescription({item, description, horizontal=false}: ItemAndDescriptionProps){
    return (
        <div className={`${styles.idGeral} ${horizontal ? styles.itemAndDescriptionH : styles.itemAndDescription}`}>
            <h3>{`${item}:`}</h3>
            <p>{description}</p>
        </div>
    )
}