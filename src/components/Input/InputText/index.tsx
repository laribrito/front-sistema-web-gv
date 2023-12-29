import React, {InputHTMLAttributes} from "react";
import stylesInput from "../input.module.css"
import styles from './inputText.module.css'
import { InputGeneric, themeMUI, variantOfInputs } from "../interfaceInput";
import { TextField, ThemeProvider } from "@mui/material";

interface InputTextProps extends InputGeneric, InputHTMLAttributes<HTMLInputElement> {
  type: "text" | "email" | "password"
  tosize?: boolean
  toMoney?: boolean
  multiline?: boolean
}

export default function InputText({type, id, label, errors, defaultValue, toMoney=false, tosize=false, multiline=false, ...rest}:InputTextProps) { 
  const hasError = errors && Array.isArray(errors)
  ? errors.find((error) => error.path[0] === id)?.message || ''
  : '';

  const styleSizes = (tosize)? {width: '50px', scale: '0.8'}: (toMoney)? {width: '130px',  scale: '0.9'}:{}
  const labelSizes = (tosize)? {textAlign: 'center', padding: '0px'}: (toMoney)? {marginLeft: '15px'}:{}

  return (
    <div className={stylesInput.formField} style={styleSizes}>
      { label && 
        <label htmlFor={id} style={labelSizes}> {!tosize && `${label}:`} {tosize && label} {rest['required'] && ' *'}</label>
      }
      <div className={styles.labelAuxInput}>
        {toMoney && 'R$: '}
        <ThemeProvider theme={themeMUI}>
          <TextField 
            variant={variantOfInputs}
            size="small"
            hiddenLabel
            id={id}
            type={type} 
            defaultValue={defaultValue && defaultValue}
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
    </div>
  );
}
