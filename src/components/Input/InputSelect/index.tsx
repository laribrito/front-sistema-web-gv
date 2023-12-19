import React, {SelectHTMLAttributes} from "react";
import stylesInput from "../input.module.css"
import { InputGeneric, Option, themeMUI, variantOfInputs } from "../interfaceInput";
import { MenuItem, Select, ThemeProvider } from "@mui/material";

interface InputSelectProps extends InputGeneric, SelectHTMLAttributes<HTMLSelectElement>{
  options: Option[] | null
}

export default function InputSelect({options, id, label, name, ...rest}:InputSelectProps) {
  return (
    <div className={stylesInput.formField}>
      <label htmlFor={id}>{`${label}:`}</label>

      <ThemeProvider theme={themeMUI}>
        <Select variant={variantOfInputs} size="small" defaultValue={1} hiddenLabel name={name} {...rest}>
          {options && options.map((op) => (
            <MenuItem key={op.id} value={op.id}>
              {op.valor}
            </MenuItem>
          ))}
        </Select>
      </ThemeProvider>
    </div>    
  );
}
