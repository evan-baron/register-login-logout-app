import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { useNavigate, Link } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [formComplete, setFormComplete] = useState(false);
	const [loginError, setLoginError] = useState(null);

	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value
		}));

		setLoginError(null);
	};

	useEffect(() => {
		if (formData.email !== '' && formData.password !== '') {
			setFormComplete(true);
		} else {
			setFormComplete(false);
		}
	}, [formData.email, formData.password])

	const handleSubmit = async () => {
		if (formComplete) {
			try {
				const response = await axiosInstance.post('/login', {
				  email: formData.email,
				  password: formData.password,
				});
				console.log('Login successful!')
				console.log(response.data);
		
				// Reset the form and related states
				setFormData({
				  email: '',
				  password: ''
				});
		
				// // Redirects to home
				navigate('/');

			} catch (error) {
				console.error('Login error: ', error.response?.data);
				setLoginError(error.response ? error.response.data.message : 'An error occurred');
				setFormComplete(false);
			}
		}
	};

	return (
		<div className='auth' role='main'>
			<h1>Login</h1>
			<form role='form'>
				<label htmlFor='email'>Email:</label>
				<div className='input-container'>
					<input
						id='email'
						type='email'
						name='email'
						placeholder=''
						onChange={handleChange}
						required
						aria-label='Enter your email address'
					/>
				</div>

				<label htmlFor='password'>Password:</label>
				<div className='input-container'>
					<input
						id='password'
						type={passwordVisible ? 'text' : 'password'}
						name='password'
						placeholder=''
						onChange={handleChange}
						required
						aria-label='Enter your password'
					/>
					{formData.password ? (
						passwordVisible ? 
						<Visibility
							className='visible'
							role='button'
							tabIndex='0'
							aria-label='Toggle password visibility'
							onClick={() => {
								setPasswordVisible((prev) => !prev);
							}}
							sx={{
								fontSize: '1.75rem',
								color: '#777777',
								outline: 'none',
							}}
						/>
						:
						<VisibilityOff 
							className='visible'
							role='button'
							tabIndex='0'
							aria-label='Toggle password visibility'
							onClick={() => {
								setPasswordVisible((prev) => !prev);
							}}
							sx={{
								fontSize: '1.75rem',
								color: '#777777',
								outline: 'none',
							}}
						/>
					) : null}
				</div>

				<button
					type='button'
					role='button'
					aria-label='Submit registration form'
					onClick={handleSubmit}
					disabled={!formComplete}
					style={{
						backgroundColor: formComplete ? null : 'rgba(0, 120, 120, .5)',
						cursor: formComplete ? 'pointer' : null,
					}}
				>
					Login
				</button>
				{loginError && (
					<p aria-live='polite' role='alert'>
						{loginError}
					</p>
				)}
				<span>
					Don't have an account?
					<br />
					<Link
						className='link'
						to='/register'
						role='link'
						aria-label='Go to register page'
					>
						Register
					</Link>
				</span>
			</form>
		</div>
	);
};

export default Login;
