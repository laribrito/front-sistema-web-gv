import React from "react";
import stylesInput from "../input.module.css"
import { InputGeneric } from "../interfaceInput";

interface InputTextProps extends InputGeneric{
  type: "text"
}

export default function InputText({type, ...rest}:InputTextProps) {
  return (
      <input type={type} className={stylesInput.box} required={rest.required}/>
  );
}
