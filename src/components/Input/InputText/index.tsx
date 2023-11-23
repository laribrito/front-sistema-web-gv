import React, {InputHTMLAttributes} from "react";
import stylesInput from "../input.module.css"
import { InputGeneric } from "../interfaceInput";

interface InputTextProps extends InputGeneric, InputHTMLAttributes<HTMLInputElement> {
  type: "text" | "email"
}

export default function InputText({type, id, label, ...rest}:InputTextProps) {
  return (
    <div className={stylesInput.formField}>
      <label htmlFor={id}>{`${label}:`}</label>
      <input type={type} className={stylesInput.box} {...rest} id={id}/>
    </div>
  );
}
