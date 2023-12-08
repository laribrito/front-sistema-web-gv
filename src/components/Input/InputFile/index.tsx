import React, { useState, InputHTMLAttributes } from 'react';
import stylesInput from "../input.module.css"
import { MuiFileInput } from 'mui-file-input';
import styles from "./inputFile.module.css"
import { InputGeneric, variantOfInputs } from "../interfaceInput";

interface FileInputProps extends InputGeneric, InputHTMLAttributes<HTMLInputElement>{}

export default function FileInput({ label, id, type, ...rest }:FileInputProps){
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (newFile: File | null) => {
    setFile(newFile);
  };

  return (
    <div className={stylesInput.formField}>
      <label htmlFor={id}>{`${label}:`}</label>
      <MuiFileInput
        value={file}
        hiddenLabel
        variant={variantOfInputs}
        placeholder='Escolha um Arquivo'
        size='small'
        onChange={handleChange}
        className={styles.boxFile}
        required={rest.required}
      />
    </div>
  );
};
