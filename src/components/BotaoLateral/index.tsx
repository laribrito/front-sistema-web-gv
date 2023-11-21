import React, { ButtonHTMLAttributes } from "react"
import styles from "./botaoLateral.module.css"
import { TbPhotoCheck } from "react-icons/tb";
import { FaTrash } from "react-icons/fa6";

interface botaoLateralProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    tipo: "IMAGEM APROVADA" | "EXCLUIR"
} 

export default function BotaoLateral({tipo, ...rest}: botaoLateralProps){
    return (
        <button className={styles.botalLateral} {...rest}>
            {tipo=="EXCLUIR" && <FaTrash fontSize='1.2em'/>}
            {tipo=="IMAGEM APROVADA" && <TbPhotoCheck fontSize='1.5em'/>}
        </button>
    )
}