import React, {InputHTMLAttributes} from "react";
import stylesInput from "../input.module.css"
import { InputGeneric, themeMUI, variantOfInputs } from "../interfaceInput";
import { TextField, ThemeProvider } from "@mui/material";

interface InputTextProps extends InputGeneric, InputHTMLAttributes<HTMLInputElement> {
  type: "text" | "email" | "password"
}

export default function InputText({type, id, label, errors, ...rest}:InputTextProps) { 
  const hasError = errors && Array.isArray(errors)
  ? errors.find((error) => error.path[0] === id)?.message || ''
  : '';

  return (
    <div className={stylesInput.formField}>
      <label htmlFor={id}>{`${label}:`}{rest['required'] && ' *'}</label>
      <ThemeProvider theme={themeMUI}>
        <TextField 
          variant={variantOfInputs}
          size="small"
          hiddenLabel
          id={id}
          type={type} 
          aria-label={rest["aria-label"]} 
          name={rest["name"]} 
          autoFocus={rest["autoFocus"]}
          error={hasError!=''}
          helperText={hasError}
          {...rest}
        />
      </ThemeProvider>
    </div>
  );
}
