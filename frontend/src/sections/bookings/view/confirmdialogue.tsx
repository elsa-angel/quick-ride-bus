import React from 'react';
import { Modal, Box, Typography, Button, Backdrop, Fade } from '@mui/material';

interface ConfirmDialogueProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialogue: React.FC<ConfirmDialogueProps> = ({ open, onConfirm, onCancel }) => (
  <Modal
    open={open}
    onClose={onCancel}
    closeAfterTransition
    BackdropComponent={Backdrop}
    BackdropProps={{
      timeout: 500,
    }}
  >
    <Fade in={open}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Cancel Booking
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Are you sure you want to cancel this booking? This action cannot be undone.
        </Typography>
        <Box mt={3} display="flex" justifyContent="flex-start">
          <Button onClick={onCancel} variant="contained" sx={{ mr: 1 }}>
            No, Keep Booking
          </Button>
          <Button onClick={onConfirm} variant="contained" color="error">
            Yes, Cancel Booking
          </Button>
        </Box>
      </Box>
    </Fade>
  </Modal>
);

export default ConfirmDialogue;
