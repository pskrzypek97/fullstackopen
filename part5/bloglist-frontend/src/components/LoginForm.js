import { useState } from 'react';

const LoginForm = ({ onLogin }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = (e) => {
		e.preventDefault();

		onLogin({ username, password });
		setUsername('');
		setPassword('');
	};

	return (
		<div>
			<h2>log in to application</h2>

			<form onSubmit={handleLogin}>
				<div>
					username{' '}
					<input
						type="text"
						value={username}
						name="Username"
						onChange={({ target }) => setUsername(target.value)}
					/>
				</div>
				<div>
					password{' '}
					<input
						type="text"
						value={password}
						name="Username"
						onChange={({ target }) => setPassword(target.value)}
					/>
				</div>
				<button type="submit">login</button>
			</form>
		</div>
	);
};

export default LoginForm;
