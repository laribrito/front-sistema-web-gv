import {SelectHTMLAttributes, useState, ChangeEvent} from "react";
import stylesInput from "../input.module.css"
import { InputGeneric, Option, themeMUI, variantOfInputs } from "../interfaceInput";
import { MenuItem, Select, SelectChangeEvent, ThemeProvider } from "@mui/material";

interface InputSelectProps extends InputGeneric, SelectHTMLAttributes<HTMLSelectElement>{
  options: Option[] | null
}

export default function InputSelect({options, id, label, name, ...rest}:InputSelectProps) {
  const [selectedValue, setSelectedValue] = useState<HTMLSelectElement | undefined>((options && options.length>0)? options[0].id as unknown as HTMLSelectElement: undefined);

  const handleSelectChange = (event: SelectChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value as HTMLSelectElement)
  };
  
  return (
    <div className={stylesInput.formField}>
      <label htmlFor={id}>{`${label}:`}</label>

      <ThemeProvider theme={themeMUI}>
        <Select 
          variant={variantOfInputs} 
          size="small" 
          value={selectedValue || ""}
          onChange={handleSelectChange}
          hiddenLabel 
          name={name} 
        >
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
