import React from 'react';
import styled from 'styled-components';
import tw from 'twin.macro';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

// Estilos personalizados para el diálogo
const StyledDialog = styled(Dialog)`
  & .MuiPaper-root {
    ${tw`p-6 rounded-lg shadow-lg`}
    background-color: #ffffff;
    max-width: 500px;
    width: 90%;
  }
`;

const StyledDialogTitle = styled(DialogTitle)`
  ${tw`text-xl font-bold text-gray-800 border-b pb-2`}
`;

const StyledDialogContent = styled(DialogContent)`
  ${tw`text-gray-700 py-4`}
`;

const StyledDialogActions = styled(DialogActions)`
  ${tw`flex justify-end border-t pt-2 mt-4`}
`;

const CustomButton = styled(Button)`
  ${tw`px-4 py-2 rounded`}
  background-color: ${({ primary }) => (primary ? '#99cdb6' : '#ccc')};
  color: ${({ primary }) => (primary ? '#fff' : '#333')};

  &:hover {
    background-color: ${({ primary }) => (primary ? '#79bda0' : '#bbb')};
  }
`;

// Componente del diálogo personalizado
const CustomDialog = ({ open, title, content, onClose, onConfirm }) => {
  return (
    <StyledDialog open={open} onClose={onClose}>
      <StyledDialogTitle>{title}</StyledDialogTitle>
      <StyledDialogContent>
        <Typography variant="body1">{content}</Typography>
      </StyledDialogContent>
      <StyledDialogActions>
        <CustomButton onClick={onClose}>Cancelar</CustomButton>
        <CustomButton primary onClick={onConfirm}>
          Confirmar
        </CustomButton>
      </StyledDialogActions>
    </StyledDialog>
  );
};

export default CustomDialog;