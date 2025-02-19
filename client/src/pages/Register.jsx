import React, { useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';
import { useNavigate, Link } from 'react-router-dom';
import { Check, Close, Visibility } from '@mui/icons-material';

const Register = () => {
	const [formData, setFormData] = useState({
		firstname: '',
		lastname: '',
		email: '',
		password: '',
		confirm: '',
	});
	const [passwordMatch, setPasswordMatch] = useState(null);
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [formComplete, setFormComplete] = useState(false);
	const [emailValid, setEmailValid] = useState(null);
	const [passwordValid, setPasswordValid] = useState(null);
	const [formSubmitted, setFormSubmitted] = useState(null);
	const [registrationError, setRegistrationError] = useState(null);

	useEffect(() => {
		const passwordsMatch =
			formData.password !== '' && formData.password === formData.confirm;
		setPasswordMatch(passwordsMatch);

		setFormComplete(
			formData.firstname.trim() !== '' &&
				formData.lastname.trim() !== '' &&
				formData.email &&
				passwordMatch
		);
	}, [
		formData.password,
		formData.confirm,
		formData.firstname,
		formData.lastname,
		formData.email,
		passwordMatch,
	]);

	// Regex for email validation
	const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	// Regex for password validation
	const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

	const navigate = useNavigate();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		if (name === 'email') {
			setEmailValid(emailRegex.test(value));
		}

		if (name === 'password') {
			setPasswordValid(passwordRegex.test(value));
		}
		setFormSubmitted(false);
		setRegistrationError(null);
	};

	const handleSubmit = async () => {
  
		setFormSubmitted(true);
	  
		if (!emailValid || !passwordValid) {
		  console.log(
			'Registration Error! Email Valid: ' +
			  emailValid +
			  ' Password Valid: ' +
			  passwordValid
		  );
		  setFormComplete(false);
		  return;
		} else {
		  console.log('Registration complete!');
		  try {
			const response = await axiosInstance.post('/register', {
			  firstname: formData.firstname.trim(),
			  lastname: formData.lastname.trim(),
			  email: formData.email.trim(),
			  password: formData.password.trim(),
			});
			console.log(response.data);
	  
			// Reset the form and related states
			setFormData({
			  firstname: '',
			  lastname: '',
			  email: '',
			  password: '',
			  confirm: '',
			});
	  
			// Reset other relevant states
			setPasswordMatch(null);
			setPasswordVisible(false);
			setFormComplete(false);
			setEmailValid(null);
			setPasswordValid(null);
			setFormSubmitted(false);
	  
			// Redirects to home
			navigate('/');

		  } catch (error) {
			console.error('Registration error: ', error.response?.data);
			setRegistrationError(error.response ? error.response.data.message : 'An error occurred');
			setFormComplete(false);
		  }
		}
	  };
	  

	return (
		<div className='auth' role='main'>
			<h1>Register</h1>
			<form role='form'>
				<label htmlFor='firstname'>First Name:</label>
				<div className='input-container'>
					<input
						id='firstname'
						type='text'
						name='firstname'
						placeholder=''
						onChange={handleChange}
						required
						aria-label='Enter your first name'
					/>
				</div>

				<label htmlFor='lastname'>Last Name:</label>
				<div className='input-container'>
					<input
						id='lastname'
						type='text'
						name='lastname'
						placeholder=''
						onChange={handleChange}
						required
						aria-label='Enter your last name'
					/>
				</div>

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
				{formSubmitted && !emailValid ? (
					<p className='validation-error' aria-live='polite'>
						Please enter a valid email address
					</p>
				) : null}

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
								color: passwordVisible ? 'rgb(40, 40, 40)' : '#bbbbbb',
								outline: 'none',
							}}
						/>
					) : null}
				</div>
				{formSubmitted && !passwordValid ? (
					<p className='validation-error' aria-live='polite'>
						Password must be at least 8 characters, include 1 uppercase letter,
						1 number, and 1 special character.
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
						backgroundColor: formComplete ? null : 'rgba(0, 120, 120, .5)',
						cursor: formComplete ? 'pointer' : null,
					}}
				>
					Register
				</button>
				{registrationError && (
					<p aria-live='polite' role='alert'>
						{registrationError}
					</p>
				)}
				<span>
					Already have an account?
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

export default Register;
