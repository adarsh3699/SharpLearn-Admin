import React, { Suspense, lazy } from 'react';
import { Routes as Switch, Route } from 'react-router-dom';

import Loader from './components/Loader/Loader';

const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const CreateAcc = lazy(() => import('./pages/CreateAccPage'));
const ForgetPasswordPage = lazy(() => import('./pages/ForgetPasswordPage'));
// const SettingsPage = lazy(() => import('./pages/SettingsPage'));

function Routes() {
	return (
		<Suspense
			fallback={
				<div className="background">
					<div id="loadingScreen">
						<div> Loading </div>
						<Loader />
					</div>
				</div>
			}
		>
			<Switch>
				<Route exact path="/" element={<LoginPage />} />
				<Route exact path="/home" element={<HomePage />} />
				<Route exact path="/register" element={<CreateAcc />} />
				<Route exact path="/forget-password" element={<ForgetPasswordPage />} />
				{/* <Route exact path="/settings" element={<SettingsPage />} /> */}

				<Route
					path="*"
					element={
						<center>
							<h1>Page not Found</h1>
						</center>
					}
				/>
			</Switch>
		</Suspense>
	);
}

export default Routes;
