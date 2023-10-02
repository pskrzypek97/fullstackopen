import { useState } from 'react';

import { TextField, Button } from '@mui/material';

import loginService from '../services/login';
import blogService from '../services/blog';
import { useUserDispatch } from '../store/UserContext';
import { useNotificationDispatch } from '../store/NotificationContext';

const LoginForm = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const userDispatch = useUserDispatch();
	const notificationDispatch = useNotificationDispatch();

	const handleLogin = async (e) => {
		e.preventDefault();

		try {
			const user = await loginService.login({ username, password });

			window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
			blogService.setToken(user.token);
			userDispatch({ type: 'SET_USER', payload: user });
		} catch (exception) {
			notificationDispatch({
				type: 'CREATE',
				payload: { value: 'wrong username or password', severity: 'error' },
			});
			setTimeout(() => {
				notificationDispatch({ type: 'REMOVE' });
			}, 5000);
		}
		setUsername('');
		setPassword('');
	};

	return (
		<div>
			<h2>log in to application</h2>

			<form onSubmit={handleLogin} className="loginForm">
				<div>
					<label htmlFor="username">username </label>
					<TextField
						type="text"
						value={username}
						name="Username"
						id="username"
						onChange={({ target }) => setUsername(target.value)}
					/>
				</div>
				<div>
					<label htmlFor="password">password </label>
					<TextField
						type="text"
						value={password}
						name="Password"
						id="password"
						onChange={({ target }) => setPassword(target.value)}
					/>
				</div>
				<Button variant="contained" type="submit" className="login-button">
					login
				</Button>
			</form>
		</div>
	);
};

export default LoginForm;
