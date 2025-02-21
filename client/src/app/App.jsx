import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import '../style.scss';
import Navbar from '../components/Navbar';

// Pages
import Home from '../pages/Home';
import Register from '../pages/Register';
import Login from '../pages/Login';

const App = () => {
	const [user, setUser] = useState(null);

	useEffect(() => {
		console.log('useEffect triggered!');
	}, [user])

	return (
		<div className='app'>
			<div className='container'>
				<BrowserRouter>
					<Navbar user={user} setUser={setUser} />
					<Routes>
						<Route path='/' element={<Home user={user} />} />
						<Route path='/register' element={<Register />} />
						<Route path='/login' element={<Login user={user} setUser={setUser} />} />
					</Routes>
				</BrowserRouter>
			</div>
		</div>
	);
};

export default App;
