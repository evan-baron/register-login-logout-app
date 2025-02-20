import React from 'react';
import axiosInstance from '../utils/axios';
import { Link } from 'react-router-dom';

const Navbar = ({ user, setUser }) => {
	const handleLogout = async () => {
		try {
			await axiosInstance.post('/logout');
			setUser(null);
		} catch (error) {
			console.error('Logout failed: ', error.response?.data || error.message);
		}
	};

	return (
		<div className='navbar'>
			<div className='nav-container'>
				<Link to='/' className='logo'>
					Home
				</Link>
				<div className='links'>
					{user ? (
						<Link to='/' className='logout' onClick={handleLogout}>
							Logout
						</Link>
					) : (
						<>
							<Link to='/login'>Login</Link>
							<Link to='/register'>Register</Link>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Navbar;
