import * as React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import './MuiBtn.css';

export default function MuiBtn({ onBtnClick, isBtnLoading, BtnText, color, sx }) {
	return (
		<Button
			variant="contained"
			color={color}
			id="basic-button"
			aria-haspopup="true"
			onClick={onBtnClick}
			disabled={isBtnLoading}
			style={sx}
			sx={{
				fontWeight: 600,
				p: 0,
				height: 40,
				width: 140,
			}}
		>
			{isBtnLoading ? <CircularProgress size={30} /> : BtnText}
		</Button>
	);
}
