import React, { HtmlHTMLAttributes } from "react"

interface HeaderTitleProps extends HtmlHTMLAttributes<HTMLElement> {
    children: React.ReactNode
}

export default function HeaderTitle({children, ...rest}: HeaderTitleProps){
    return (
        <h1>{children}</h1>
    )
}