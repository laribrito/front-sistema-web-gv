import { createTheme } from "@mui/material";

export interface InputGeneric{
    label: string
}

export interface Option {
    id: number;
    valor: string;
}

const styleMUI = {
    // Name of the slot
    root: {
      // Some CSS
      width: '100%',
      background: 'white'
    },
  }

export const themeMUI = createTheme({
    components: {
      // Name of the component
      MuiTextField: {
        styleOverrides: styleMUI
      }, 
      MuiSelect: {
        styleOverrides: styleMUI
      },
    },
  });