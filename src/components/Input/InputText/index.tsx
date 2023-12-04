import React, {InputHTMLAttributes} from "react";
import stylesInput from "../input.module.css"
import { InputGeneric, themeMUI } from "../interfaceInput";
import { TextField, ThemeProvider } from "@mui/material";

interface InputTextProps extends InputGeneric, InputHTMLAttributes<HTMLInputElement> {
  type: "text" | "email" | "password"
}

export default function InputText({type, id, label, ...rest}:InputTextProps) { 
  return (
    <div className={stylesInput.formField}>
      <label htmlFor={id}>{`${label}:`}</label>
      <ThemeProvider theme={themeMUI}>
        <TextField 
          id="outlined-basic" 
          variant="outlined" 
          size="small" 
          type={type} 
          onChange={rest.onChange} 
          name={rest['name']}
          aria-label={rest['aria-label']}
          autoFocus = {rest['autoFocus']}
        />
      </ThemeProvider>
    </div>
  );
}
