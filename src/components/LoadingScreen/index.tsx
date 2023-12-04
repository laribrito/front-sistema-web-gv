import React from "react"
import styles from "./loadingScreen.module.css"

export default function LoadingScreen(){
    return (
        <div className={styles.bgLoading}>
            <div className={styles.gifLoading}></div>
        </div>
    )
}