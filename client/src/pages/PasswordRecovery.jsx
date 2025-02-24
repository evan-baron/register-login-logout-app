import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { useNavigate, Link } from 'react-router-dom';

const PasswordRecovery = () => {
	const [formData, setFormData] = useState({
		email: ''
	});
	const [formComplete, setFormComplete] = useState(false);

	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value
		}));
	};

	useEffect(() => {
		if (formData.email !== '') {
			setFormComplete(true);
		} else {
			setFormComplete(false);
		}
	}, [formData.email])

	const handleSubmit = async () => {
		if (formComplete) {
			try {
				const response = await axiosInstance.post('/recover-password', {
				  email: formData.email
				});

        console.log(response.data);
		
				// Reset the form and related states
        // console.log(formData.email);
				// setFormData({
				//   email: '',
				// });
		
				// // Redirects to home
				// navigate('/');

			} catch (error) {
				console.error('Error: ', error.response?.data);
				// setFormComplete(false);
			}
		}
	};

	return (
		<div className='auth' role='main'>
			<h1>Recover Password</h1>
			<form role='form'>
        <h2>Please enter your email address below to receive a password reset link.</h2>
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
					Send Recovery
				</button>

				<span>
					Return to Login?
					<br />
					<Link
						className='link'
						to='/login'
						role='link'
						aria-label='Go to login page'
					>
						Login
					</Link>
				</span>
			</form>
		</div>
	);
};

export default PasswordRecovery;
