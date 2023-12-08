import React, { useState, InputHTMLAttributes } from 'react';
import stylesInput from "../input.module.css"
import { InputGeneric } from "../interfaceInput";
import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import {Option} from "../interfaceInput"

interface InputRadioGroupProps extends InputGeneric, InputHTMLAttributes<HTMLInputElement>{
    vertical?: boolean
    options: Option[] | null
}

export default function InputRadioGroup({ label, id, type, options, name, vertical=false, ...rest }:InputRadioGroupProps){
    const radioConfig = <Radio size='small' color='default'/>;
  return (
    <div className={stylesInput.formField}>
      <label htmlFor={id}>{`${label}:`}</label>
        {options && 
          <RadioGroup
              defaultValue={1}
              name={name}
              row={!vertical}
          >
              {options.map(
                  (op)=>(
                      <FormControlLabel key={op.id} value={op.id} control={radioConfig} label={op.valor} />
                  )
              )}
          </RadioGroup>
        }
    </div>
  );
};
