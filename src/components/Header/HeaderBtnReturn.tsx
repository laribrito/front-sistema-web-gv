import React, { HtmlHTMLAttributes } from "react"
import { IoIosArrowBack } from "react-icons/io";
import styles from "./header.module.css"
import { useRouter } from "next/navigation";

interface HeaderBtnReturnProps extends HtmlHTMLAttributes<HTMLButtonElement>{
  goto?: string
}

export default function HeaderBtnReturn({goto, ...rest}: HeaderBtnReturnProps){
    const router = useRouter()
    return (
        <button className={styles.btnReturn}
            onClick={()=>{
                if(goto) router.push(goto)
                else router.back()
            }}
         {...rest}
         >
            <IoIosArrowBack fontSize="1.8em" />
        </button>
    )
}