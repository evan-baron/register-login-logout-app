import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
	return (
		<div className='navbar'>
			<div className="nav-container">
				<div className="logo">Home</div>
				<div className="links">
					<div className="user">User</div>
					<Link to='/login'>Login</Link>
					<Link to='/register'>Register</Link>
					<div className="logout">Logout</div>
				</div>
			</div>
		</div>
	)
};

export default Navbar;
