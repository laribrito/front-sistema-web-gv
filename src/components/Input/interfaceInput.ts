import { createTheme } from "@mui/material";
import { ZodIssue } from "zod";

export interface InputGeneric{
    label: string
    errors?: ZodIssue[]
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
  },
  input: {
    background: "white",
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

export const variantOfInputs = "filled" 