import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { Link } from 'react-router-dom';

const PasswordRecovery = () => {
	const [formData, setFormData] = useState({
		email: '',
	});
	const [formComplete, setFormComplete] = useState(false);
	const [emailSent, setEmailSent] = useState(false);
	const [errorMessage, setErrorMessage] = useState(null);

	const handleChange = (e) => {
		const { name, value } = e.target;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	useEffect(() => {
		const emailIsValid =
			formData.email.includes('@') && formData.email.includes('.');
		setFormComplete(emailIsValid);
	}, [formData.email]);

	const handleSubmit = async () => {
		if (formComplete) {
			try {
				const data = await axiosInstance.post('/recover-password', {
					email: formData.email,
				});

				if (data) {
					setEmailSent(true);

					// Reset the form and related states
					setFormData({
						email: '',
					});
				}
			} catch (error) {
				setErrorMessage(
					'There was an issue sending the reset email. Please try again.'
				);
				console.error('Error: ', error.response?.data);
			}
		}
	};

	return (
		<div className='auth' role='main'>
			{!emailSent && (
				<section aria-labelledby='password-recovery-form'>
					<h1 id='password-recovery-form'>Recover Password</h1>
					<form role='form'>
						<h2>
							Please enter your email address below to receive a password reset
							link.
						</h2>
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
							Reset Password
						</button>

						{errorMessage && (
							<div className='error-message'>{errorMessage}</div>
						)}

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
				</section>
			)}
			{emailSent && (
				<div className='recovery-sent'>
					<h2>
						A password reset link has been sent to your email.
						<br />
						<br />
						Please check your inbox shortly. If you don't see it, please check
						your spam or junk folder.
					</h2>
					<h2>
						<Link
							className='link'
							to='/login'
							role='link'
							aria-label='Go to login page'
						>
							Return to Login
						</Link>
					</h2>
				</div>
			)}
		</div>
	);
};

export default PasswordRecovery;
