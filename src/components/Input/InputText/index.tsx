import React, {InputHTMLAttributes} from "react";
import stylesInput from "../input.module.css"
import { InputGeneric, themeMUI, variantOfInputs } from "../interfaceInput";
import { TextField, ThemeProvider } from "@mui/material";

interface InputTextProps extends InputGeneric, InputHTMLAttributes<HTMLInputElement> {
  type: "text" | "email" | "password"
  tosize?: boolean
  multiline?: boolean
}

export default function InputText({type, id, label, errors, tosize=false, multiline=false, ...rest}:InputTextProps) { 
  const hasError = errors && Array.isArray(errors)
  ? errors.find((error) => error.path[0] === id)?.message || ''
  : '';

  const styleSizes = (tosize)? {width: '50px', scale: '0.8'}:{}
  const labelSizes = (tosize)? {textAlign: 'center', padding: '0px'}:{}

  return (
    <div className={stylesInput.formField} style={styleSizes}>
      <label htmlFor={id} style={labelSizes}> {!tosize && `${label}:`} {tosize && label} {rest['required'] && ' *'}</label>
      <ThemeProvider theme={themeMUI}>
        <TextField 
          variant={variantOfInputs}
          size="small"
          hiddenLabel
          id={id}
          type={type} 
          multiline = {multiline}
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
