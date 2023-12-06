import React, { HtmlHTMLAttributes } from "react"
import { IoIosArrowBack } from "react-icons/io";
import styles from "./header.module.css"

export default function HeaderBtnReturn({...rest}: HtmlHTMLAttributes<HTMLButtonElement>){
    return (
        <button className={styles.btnReturn}
            onClick={()=>{
                history.back()
            }}
         {...rest}
         >
            <IoIosArrowBack fontSize="1.8em" />
        </button>
    )
}