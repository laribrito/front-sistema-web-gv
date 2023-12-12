import React, { useState, InputHTMLAttributes, ChangeEvent } from 'react';
import stylesInput from '../input.module.css';
import { InputGeneric, variantOfInputs } from '../interfaceInput';
import { Button, styled } from '@mui/material';
import Thumbnail from './thumbnail';
import Modal from '@/components/Modal/index'

const CustomButton = styled(Button)({
  backgroundColor: '#e5e5e5ff',
  color: '#000000',
  boxShadow: 'none',
  textTransform: 'capitalize',
  borderRadius: '5px 5px 0 0',
  borderBottom: 'solid 0.001cm',
  width: '100%',
  '&:hover': {
    backgroundColor: '#dddddd',
    boxShadow: 'none',
  },
});

interface FileInputProps extends InputGeneric, InputHTMLAttributes<HTMLInputElement> {}

export default function FileInput({ label, id, type, ...rest }: FileInputProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const selectedFiles = Array.from(event.target.files);
      setFiles(selectedFiles);
    }
  };

  const handleDeleteFile = (fileToDelete: File) => {
    // Remover o arquivo da lista
    const updatedFiles = files.filter((f) => f !== fileToDelete);
    setFiles(updatedFiles);
  
    // Se o arquivo excluído é o arquivo selecionado, fechar o popup
    if (selectedFile === fileToDelete) {
      setSelectedFile(null);
    }
  };
  

  return (
    <div className={stylesInput.formField}>
      <label htmlFor={id}>{`${label}:`}</label>
      <CustomButton variant="contained" component="label">
        Upload
        <input type="file" style={{ display: 'none' }} onChange={handleChange} multiple />
      </CustomButton>

      {files.length > 0 && (
        <div>
          <p style={{ marginTop: '5px' }}>Arquivos Selecionados:</p>
          <div style={{ display: 'flex', listStyle: 'none', padding: 0 }}>
            {files.map((file, index) => (
              <Thumbnail key={`thumbnail-${index}`} file={file} index={index} onDelete={() => handleDeleteFile(file)} />            
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
