import React from "react";
import stylesInput from "../input.module.css"
import styles from "./inputsSelect.module.css"
import { InputGeneric } from "../interfaceInput";

interface InputTextProps extends InputGeneric{
  options: Array<[number, string]>
}

export default function InputText({options, ...rest}:InputTextProps) {
  return (
    <select {...rest} className={`${stylesInput.box} ${styles.select}`}>
      {options.map(([id, valor]) => (
        <option key={id} value={id} className={styles.selectItens}>
          {valor}
        </option>
      ))}
    </select>
  );
}
