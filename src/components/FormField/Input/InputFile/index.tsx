import React, { useState } from 'react';
import { MuiFileInput } from 'mui-file-input';
import styles from "./inputFile.module.css"
import { InputGeneric } from "../interfaceInput";

interface FileInputProps extends InputGeneric {
  type: "file";
}

export default function FileInput({ type, ...rest }:FileInputProps){
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (newFile: File | null) => {
    setFile(newFile);
  };

  return (
    <MuiFileInput
      value={file}
      placeholder='Escolha um Arquivo'
      size='small'
      onChange={handleChange}
      className={styles.boxFile}
      required={rest.required}
    />
  );
};
