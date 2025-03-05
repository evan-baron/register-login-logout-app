import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import axiosInstance from '../utils/axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Close, Visibility, VisibilityOff } from '@mui/icons-material';

const PasswordReset = () => {
	const [searchParams] = useSearchParams();
	const token = searchParams.get('token');

	const [passwordMatch, setPasswordMatch] = useState(null);
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [passwordValid, setPasswordValid] = useState(null);
	const [formComplete, setFormComplete] = useState(false);
	const [formData, setFormData] = useState({
		password: '',
		confirm: '',
	});
	const [formSubmitted, setFormSubmitted] = useState(null);
	const [errorMessage, setErrorMessage] = useState(null);
	const [tokenValid, setTokenValid] = useState(null);
	const [resendEmail, setResendEmail] = useState(null);
	const [emailSent, setEmailSent] = useState(false);

	const navigate = useNavigate();

	dayjs.extend(utc);
	dayjs.extend(timezone);

	useEffect(() => {
		const validateRecoveryToken = async () => {
			if (!token) {
				console.log('No token found. Redirecting to home.');
				navigate('/');
			} else {
				console.log('Token exists: ', token);
				try {
					const response = await axiosInstance.get(
						'/authenticateRecoveryToken',
						{ params: { token: token } }
					);
					console.log(response.data);
					const tokenCreatedAt = response.data.timestamp;
					const now = dayjs().utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

					const difference = dayjs(now).diff(dayjs(tokenCreatedAt)) / 1000 / 60;

					console.log(tokenCreatedAt);
					console.log(now);

					console.log(difference);

					if (difference < 10) {
						setTokenValid(true);
					} else {
						setTokenValid(false);
						setResendEmail(response.data.email);
					}
				} catch (error) {
					console.error('Error authenticating token: ', error);
				}
			}
		};
		validateRecoveryToken();
	}, [token]);

	useEffect(() => {
		const passwordsMatch =
			formData.password !== '' && formData.password === formData.confirm;
		setPasswordMatch(passwordsMatch);

		setFormComplete(passwordMatch);
	}, [formData.password, formData.confirm, passwordMatch]);

	// Regex for password validation
	const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (name === 'password') {
			setPasswordValid(passwordRegex.test(value));
		}
		setFormSubmitted(false);
		setRegistrationError(null);
	};

	const handleSubmit = async () => {
		
		if (tokenValid) {
			setFormSubmitted(true);
	
			if (!passwordValid) {
				console.log(
					'Registration Error! Email Valid: Password Valid: ' + passwordValid
				);
				setFormComplete(false);
				return;
			} else {
				setFormComplete(false);
				// try {
				// 	const response = await axiosInstance.post('/reset-password', {
				// 		token, // Sending token in the request body
				// 		password: formData.password.trim(),
				// 		timestamp,
				// 	});
				// 	console.log('Registration complete!');
				// 	console.log(response.data);
	
				// 	// Reset the form and related states
				// 	setFormData({
				// 		firstname: '',
				// 		lastname: '',
				// 		email: '',
				// 		password: '',
				// 		confirm: '',
				// 	});
	
				// 	// Reset other relevant states
				// 	setPasswordMatch(null);
				// 	setPasswordVisible(false);
				// 	setFormComplete(false);
				// 	setEmailValid(null);
				// 	setPasswordValid(null);
				// 	setFormSubmitted(false);
	
				// 	// Redirects to home
				// 	navigate('/login');
				// } catch (error) {
				// 	console.error('Registration error: ', error.response?.data);
				// 	setErrorMessage(
				// 		error.response ? error.response.data.message : 'An error occurred'
				// 	);
				// 	setFormComplete(false);
				// }
			}	
		} else {
			console.log(token);
			console.log(resendEmail);
			setFormComplete(true);
			try {
				const data = await axiosInstance.post('/recover-password', {
					email: resendEmail,
				});

				if (data) {
					setEmailSent(true);
					setResendEmail(null);
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
			<section aria-labelledby='password-recovery-form'>
				<h1 id='password-recovery-form'>Reset Password</h1>
				<form role='form'>
					{tokenValid ? (
						<>
							<h2>Please enter a new password.</h2>

							<label htmlFor='password'>New Password:</label>
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
									passwordVisible ? (
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
									) : (
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
									)
								) : null}
							</div>
							{formSubmitted && !passwordValid ? (
								<p className='validation-error' aria-live='polite'>
									Password must be at least 8 characters, include 1 uppercase
									letter, 1 number, and 1 special character.
								</p>
							) : null}

							<label htmlFor='confirm'>Confirm Password:</label>
							<div className='input-container'>
								<input
									id='confirm'
									type='password'
									name='confirm'
									placeholder=''
									onChange={handleChange}
									required
									aria-label='Confirm your password'
								/>

								{passwordMatch !== null && formData.confirm ? (
									passwordMatch ? (
										<Check
											className='validatePw'
											role='img'
											aria-label='Passwords match'
											sx={{ color: 'rgb(0, 200, 0)', fontSize: '2rem' }}
										/>
									) : (
										<Close
											className='validatePw'
											role='img'
											aria-label='Passwords do not match'
											sx={{ color: 'rgb(255, 0, 0)', fontSize: '2rem' }}
										/>
									)
								) : null}
							</div>

							<button
								type='button'
								role='button'
								aria-label='Submit registration form'
								onClick={handleSubmit}
								disabled={!formComplete}
								style={{
									backgroundColor: formComplete
										? null
										: 'rgba(0, 120, 120, .5)',
									cursor: formComplete ? 'pointer' : null,
								}}
							>
								Reset Password
							</button>

							{errorMessage && (
								<p aria-live='polite' role='alert'>
									{errorMessage}
								</p>
							)}
						</>
					) : (
						!emailSent ? (
							<>
								<h2>Your token has expired.</h2>
								<button
									type='button'
									role='button'
									aria-label='Resend password'
									onClick={handleSubmit}
									disabled={formComplete}
									style={{
										backgroundColor: !formComplete
											? null
											: 'rgba(0, 120, 120, .5)',
										cursor: !formComplete ? 'pointer' : null,
									}}
								>
									Resend Link
								</button>
							</>
						) : (
							<>
								<h2>
									A password reset link has been sent to your email.
									<br />
									<br />
									Please check your inbox shortly. If you don't see it, please
									check your spam or junk folder.
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
							</>
						)
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
		</div>
	);
};

export default PasswordReset;
