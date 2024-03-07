import React, { useState, useEffect, useCallback } from 'react';
import { handleUserState, handleLoginForm } from '../firebase/auth';
import { NavLink } from 'react-router-dom';
import Loader from '../components/Loader/Loader';

import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { amber } from '@mui/material/colors';

import '../styles/loginPage.css';
import logologoSizeL from '../images/logoSizeL.png';

function LoginPage() {
	const [msg, setMsg] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [isApiLoading, setIsApiLoading] = useState(false);
	const [ispasswordVisible, setIspasswordVisible] = useState(false);

	useEffect(() => {
		handleUserState('loginPage');
		if (JSON.parse(localStorage.getItem('user_details'))) {
			document.location.href = '/home';
		} else {
			setIsLoading(false);
		}
	}, []);

	const handlePasswordVisibility = useCallback(() => {
		setIspasswordVisible(!ispasswordVisible);
	}, [ispasswordVisible]);

	const handleUserLogin = useCallback((e) => {
		handleLoginForm(e, setMsg, setIsApiLoading);
	}, []);

	const handleMsgHideOnKeyUp = useCallback((e) => {
		setMsg('');
	}, []);

	return (
		<>
			{!isLoading && (
				<div id="loginPage">
					<div id="wrapper">
						<img id="myLogo" src={logologoSizeL} alt="" />
						<div id="Title">SharpLearn</div>
						<form className="form" onSubmit={handleUserLogin}>
							<input
								type="email"
								name="email"
								placeholder="Email"
								disabled={isApiLoading}
								className="inputBottomMargin"
								onKeyDown={handleMsgHideOnKeyUp}
							/>
							<input
								type={ispasswordVisible ? 'text' : 'password'}
								name="password"
								placeholder="Password"
								disabled={isApiLoading}
								className=""
								onKeyDown={handleMsgHideOnKeyUp}
							/>

							<div id="showPassword">
								<FormControlLabel
									control={
										<Checkbox
											onClick={handlePasswordVisibility}
											sx={{
												color: amber[400],
												'&.Mui-checked': {
													color: amber[600],
												},
											}}
										/>
									}
									label="Show password"
								/>
							</div>

							<button id="login" className={isApiLoading ? 'isLogin' : ''}>
								Login
							</button>
						</form>

						<div id="msg" className="red" style={isApiLoading ? { marginBottom: '0px' } : {}}>
							{' '}
							{msg}{' '}
						</div>
						<Loader isLoading={isApiLoading} />
						<NavLink to="/forget-password" id="forgotPass">
							Forgotten Password
						</NavLink>

						<hr />
						<NavLink to="/register">
							<div id="createAcc">Create New Account</div>
						</NavLink>
					</div>
				</div>
			)}
		</>
	);
}

export default LoginPage;
