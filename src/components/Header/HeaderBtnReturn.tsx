import React, { HtmlHTMLAttributes } from "react"
import { IoIosArrowBack } from "react-icons/io";
import styles from "./header.module.css"
import { useRouter } from "next/navigation";
import { useComponentsContext } from "@/context/componentsContext";

interface HeaderBtnReturnProps extends HtmlHTMLAttributes<HTMLButtonElement>{
  goto?: string
}

export default function HeaderBtnReturn({goto, ...rest}: HeaderBtnReturnProps){
    const router = useRouter()
    const { setLoading } = useComponentsContext()
    return (
        <button className={styles.btnReturn}
            onClick={()=>{
                setLoading(true)
                if(goto) router.push(goto)
                else router.back()
            }}
         {...rest}
         >
            <IoIosArrowBack fontSize="1.8em" />
        </button>
    )
}