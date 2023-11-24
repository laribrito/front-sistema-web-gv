import React, { HtmlHTMLAttributes } from "react"

interface HeaderSubtitleProps extends HtmlHTMLAttributes<HTMLElement> {
    children: React.ReactNode
}

export default function HeaderSubtitle({children, ...rest}: HeaderSubtitleProps){
    return (
        <h2>{children}</h2>
    )
}