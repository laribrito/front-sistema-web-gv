import React from 'react';
import { Modal, Button, Theme } from '@mui/material';
import { styled } from '@mui/system';

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
  wordBreak: 'break-word',
});

interface ModalYesOrNoProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  question: string;
}

const ModalYesOrNo: React.FC<ModalYesOrNoProps> = ({ open, onClose, onConfirm, question }) => {
  return (
    <CustomModal open={open} onClose={onClose}>
      <ModalContent>
        <h3 style={{ width: '85%' }}>{question}</h3>
        <div style={{marginTop: '10px', textAlign: 'center'}}>
            <Button onClick={onClose} variant="contained" color="error">
            Não
            </Button>
            <Button onClick={onConfirm} variant="contained" color="success" style={{ marginLeft: '10px' }}>
            Sim
            </Button>
        </div>
      </ModalContent>
    </CustomModal>
  );
};

export default ModalYesOrNo;
