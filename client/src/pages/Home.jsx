import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home = ({ loading, user, setUser }) => {
	return (
		<div className="home">
			<div className="home-container">
				{!loading && (user ? (
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
					))
				}
			</div>
		</div>
	);
};

export default Home;
