import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axios';

const Home = ({ user, setUser }) => {

	useEffect(() => {
		const fetchUserData = async () => {
			const token = localStorage.getItem('token')

			if (token) {
				console.log('Token exists!');
				console.log(token);
				try {
					const response = await axiosInstance.get('/authenticate', {
						headers: { Authorization: `Bearer ${token}` },
						withCredentials: true,
					})

					setUser(response.data);
				} catch (error) {
					console.error('Error authenticating: ', error);
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
				}
			} else {
				console.log('No tokens found. Please log in.');
			}
		}

		fetchUserData();
	}, []);


	return (
		<div className="home">
			<div className="home-container">
				{user ? (
					<h1>{`Welcome, ${user.user.first_name}!`}</h1>
				) : (
					<>
						<h2>Welcome!</h2>
						<div className="button-container">
							<Link to='/login' className='button'>
								Login
							</Link>
							<p>or</p>
							<Link to='/register' className='button'>
								Register
							</Link>
						</div>
					</>
				)}
			</div>
		</div>
	);
};

export default Home;
