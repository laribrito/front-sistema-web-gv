import React from "react"
import Label from "../Label"

interface FormFieldLabelProps{
    valor: string
    required?: boolean
}

export default function FormFieldLabel({valor, required=false, ...rest}:FormFieldLabelProps){
    return (
        <Label tipo="label" valor={`${valor}:${required? " *": ""}`} {...rest}/>
    )
}