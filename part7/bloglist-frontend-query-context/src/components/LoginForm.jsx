import { useState } from 'react';

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
				payload: { value: 'wrong username or password', color: 'red' },
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
					username{' '}
					<input
						type="text"
						value={username}
						name="Username"
						id="username"
						onChange={({ target }) => setUsername(target.value)}
					/>
				</div>
				<div>
					password{' '}
					<input
						type="text"
						value={password}
						name="Password"
						id="password"
						onChange={({ target }) => setPassword(target.value)}
					/>
				</div>
				<button type="submit" className="login-button">
					login
				</button>
			</form>
		</div>
	);
};

export default LoginForm;
