import React, { useState } from 'react';
import { Modal, Button, Theme } from '@mui/material'; // Certifique-se de importar os componentes necessários do Material-UI
import { IconGeneric, IconPDF } from '@/utils/elements';
import '../input.module.css';
import { styled } from '@mui/system';

interface ThumbnailProps {
  file: File;
  index: number;
  onDelete: (file: File) => void;
}

const CustomModal = styled(Modal)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});
  
const ModalContent = styled('div')({
  backgroundColor: 'white',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '16px 16px 35px 16px',
  maxWidth: '320px',
  width: '100%',
  wordBreak: 'break-word'
});

const Thumbnail: React.FC<ThumbnailProps> = ({ file, index, onDelete }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleThumbnailClick = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleDelete = () => {
    onDelete(file);
    setModalOpen(false);
  };

  const getThumbnail = (file: File, index: number, click: () => void, thumbnailStyle?: React.CSSProperties): React.ReactNode => {
    if (file.type.includes('image')) {
      // Se for uma imagem, retorna a miniatura da própria imagem
      return (
        <img
          src={URL.createObjectURL(file)}
          alt={`Thumbnail ${index + 1}`}
          style={thumbnailStyle}
          onClick={click}
        />
      );
    } else if (file.type.includes('pdf')) {
      // Se for um PDF, retorna o componente de ícone específico para PDF
      return <IconPDF 
        key={`pdf-thumbnail-${index}`} 
        style={thumbnailStyle} 
        onClick={click} />;
    } else {
      // Adicione mais casos para outros tipos de arquivos, se necessário
      return <IconGeneric 
        key={`generic-thumbnail-${index}`} 
        style={thumbnailStyle} 
        onClick={click} />;
    }
  };

  return (
    <div key={`thumbnail-${index}`} style={{ marginRight: '10px', cursor: 'pointer' }}>
      {getThumbnail(file, index, handleThumbnailClick, { height: '50px', width: '50px' })}
      <CustomModal open={modalOpen} onClose={handleCloseModal} >
        <ModalContent>
          <Button onClick={handleDelete} variant="contained" color="error">
            Excluir Arquivo
          </Button>
          <h3 style={{width: '85%'}}>{file.name}</h3>
          {getThumbnail(file, index, handleThumbnailClick, { maxHeight: '60vh', maxWidth: '80%', minHeight: '150px', minWidth: '150px'})}
        </ModalContent>
      </CustomModal>
    </div>
  );
};

export default Thumbnail;
