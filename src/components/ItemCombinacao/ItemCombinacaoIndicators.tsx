import React from "react"
import { GrTextAlignRight } from "react-icons/gr";
import { IoDocumentTextOutline } from "react-icons/io5";

interface itemCombinacaoIndicatorsProps {
    tipo: "obs" | "anexo"
} 

export default function ItemCombinacao({tipo}: itemCombinacaoIndicatorsProps){
    return (
        <span>
            {tipo=="obs" && <GrTextAlignRight fontSize='1em'/>}
            {tipo=="anexo" && <IoDocumentTextOutline fontSize='1.2em'/>}
        </span>
    )
}