import React from 'react';

import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material/';

function ConfirmationDialog({ title, message, isOpen, onCancel, onYesClick }) {
	return (
		<Dialog
			open={isOpen}
			onClose={onCancel}
			fullWidth
			maxWidth="xs"
			aria-labelledby="alert-dialog-title"
			aria-describedby="alert-dialog-description"
			keepMounted={false}
		>
			<DialogTitle id="alert-dialog-title">{title}</DialogTitle>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">{message}</DialogContentText>
			</DialogContent>
			<DialogActions
				style={{
					display: 'flex}',
					justifyContent: 'space-around',
					margin: '0 12px 12px 12px',
				}}
			>
				<Button variant="contained" color="primary" size="medium" fullWidth={true} onClick={onCancel}>
					No
				</Button>

				<Button variant="contained" color="error" size="medium" fullWidth={true} onClick={onYesClick}>
					Yes
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default ConfirmationDialog;
