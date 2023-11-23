import React, {InputHTMLAttributes} from "react";
import stylesInput from "../input.module.css"
import { InputGeneric } from "../interfaceInput";
import { TextField, ThemeProvider, createTheme } from "@mui/material";

interface InputTextProps extends InputGeneric, InputHTMLAttributes<HTMLInputElement> {
  type: "text" | "email"
}

export default function InputText({type, id, label, ...rest}:InputTextProps) {
  const theme = createTheme({
    components: {
      // Name of the component
      MuiTextField: {
        styleOverrides: {
          // Name of the slot
          root: {
            // Some CSS
            width: '100%',
            background: 'white'
          },
        },
      },
    },
  });
  
  return (
    <div className={stylesInput.formField}>
      <label htmlFor={id}>{`${label}:`}</label>
      <ThemeProvider theme={theme}>
        <TextField id="outlined-basic" variant="outlined" size="small"/>
      </ThemeProvider>
    </div>
  );
}
