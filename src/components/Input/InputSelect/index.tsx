import React, {SelectHTMLAttributes} from "react";
import stylesInput from "../input.module.css"
import styles from "./inputsSelect.module.css"
import { InputGeneric } from "../interfaceInput";

interface InputSelectProps extends InputGeneric, SelectHTMLAttributes<HTMLSelectElement>{
  options: Array<[number, string]>
}

export default function InputSelect({options, id, label, ...rest}:InputSelectProps) {
  return (
    <div className={stylesInput.formField}>
      <label htmlFor={id}>{`${label}:`}</label>
      <select {...rest} className={`${stylesInput.box} ${styles.select}`}>
      {options.map(([id, valor]) => (
        <option key={id} value={id} className={styles.selectItens}>
          {valor}
        </option>
      ))}
    </select>
    </div>    
  );
}
