import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom';
import '../style.scss';
import axiosInstance from '../utils/axios';

// Pages
import Home from '../pages/Home';
import Register from '../pages/Register';
import Login from '../pages/Login';
import PasswordRecovery from '../pages/PasswordRecovery';
import PasswordReset from '../pages/PasswordReset';

// Components
import Navbar from '../components/Navbar';

const App = () => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchUserData = async () => {
			const token = localStorage.getItem('token')

			if (token) {
				console.log('Token exists!');
				console.log(token);
				try {
					const response = await axiosInstance.get('/authenticate', {
						headers: { Authorization: `Bearer ${token}` }
					})

					setUser(response.data);
				} catch (error) {
					console.error('Error authenticating: ', error);
					console.log('No tokens found. Please log in.');
				}
			} else if (!token) {
				console.log('No token found. Checking cookies...');
				try { 
					const response = await axiosInstance.get('/authenticate', {
						withCredneitials: true,
					});

					setUser(response.data);
				} catch (error) {
					console.error('Error authenticating: ', error);
					console.log('No tokens found. Please log in.');
				}
			} else {
				console.log('No tokens found. Please log in.');
			}

			setLoading(false);
		}

		fetchUserData();
	}, [loading]);

	useEffect(() => {
		console.log('useEffect triggered!');
	}, [user])

	return (
		<div className='app'>
			<div className='container'>
				<BrowserRouter>
					<Navbar user={user} setUser={setUser} />
					<Routes>
						<Route path='/' element={<Home loading={loading} user={user} />} />
						<Route path='/register' element={user ? <Navigate to='/' /> : <Register />} />
						<Route path='/login' element={user ? <Navigate to='/' /> : <Login setUser={setUser} />} />
						<Route path='/recovery' element={user ? <Navigate to='/' /> : <PasswordRecovery />} />
						<Route path='/reset-password/:token' element={user ? <Navigate to='/' /> : <PasswordReset />} />
					</Routes>
				</BrowserRouter>
			</div>
		</div>
	);
};

export default App;
