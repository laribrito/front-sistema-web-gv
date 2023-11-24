import React, { HtmlHTMLAttributes } from "react"
import { IoIosArrowBack } from "react-icons/io";
import styles from "./header.module.css"

export default function HeaderBtnReturn({...rest}: HtmlHTMLAttributes<HTMLButtonElement>){
    return (
        <button className={styles.btnReturn} {...rest}>
            <IoIosArrowBack fontSize="2.2em" />
        </button>
    )
}