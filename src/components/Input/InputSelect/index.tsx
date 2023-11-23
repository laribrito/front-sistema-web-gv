import React, {SelectHTMLAttributes} from "react";
import stylesInput from "../input.module.css"
import styles from "./inputsSelect.module.css"
import { InputGeneric, Option } from "../interfaceInput";

interface InputSelectProps extends InputGeneric, SelectHTMLAttributes<HTMLSelectElement>{
  options: Option[]
}

export default function InputSelect({options, id, label, ...rest}:InputSelectProps) {
  return (
    <div className={stylesInput.formField}>
      <label htmlFor={id}>{`${label}:`}</label>
      <select {...rest} className={`${stylesInput.box} ${styles.select}`}>
      {options.map((op) => (
        <option key={op.id} value={op.id} className={styles.selectItens}>
          {op.valor}
        </option>
      ))}
    </select>
    </div>    
  );
}
