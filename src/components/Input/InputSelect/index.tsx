import {SelectHTMLAttributes, useState, ChangeEvent, useEffect} from "react";
import stylesInput from "../input.module.css"
import { InputGeneric, Option, themeMUI, variantOfInputs } from "../interfaceInput";
import { MenuItem, Select, SelectChangeEvent, ThemeProvider } from "@mui/material";

interface InputSelectProps extends InputGeneric, SelectHTMLAttributes<HTMLSelectElement>{
  options: Option[] | null
  defaultValue?: string
}

export default function InputSelect({options, id, label, name, defaultValue, ...rest}:InputSelectProps) {
  var initialValue = ''

  if(defaultValue) initialValue = defaultValue
  else if(options && options.length>0) initialValue = options[0].id.toString()

  const [selectedValue, setSelectedValue] = useState<String>(initialValue);
  
  useEffect(()=>{
    if(!selectedValue)
      if(defaultValue) setSelectedValue(defaultValue)
      else if(options && options.length>0) setSelectedValue(options[0].id.toString())
  }, [options, defaultValue])


  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setSelectedValue(event.target.value as string)
  };
  
  return (
    <div className={stylesInput.formField}>
      <label htmlFor={id}>{`${label}:`}</label>

      <ThemeProvider theme={themeMUI}>
        <Select 
          variant={variantOfInputs} 
          size="small" 
          value={selectedValue}
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
