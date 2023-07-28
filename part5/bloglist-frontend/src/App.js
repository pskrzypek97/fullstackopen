import { useState, useEffect } from 'react';
import Blog from './components/Blog';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [user, setUser] = useState(null);
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');
	const [url, setUrl] = useState('');
	const [notification, setNotification] = useState(null);
	const [notificationColor, setNotificationColor] = useState(null);

	useEffect(() => {
		blogService.getAll().then((blogs) => setBlogs(blogs));
	}, []);

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			setUser(user);
			blogService.setToken(user.token);
		}
	}, []);

	const handleLogin = async (e) => {
		e.preventDefault();

		try {
			const user = await loginService.login({ username, password });

			window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
			blogService.setToken(user.token);
			setUser(user);
			setUsername('');
			setPassword('');
		} catch (exception) {
			setNotification('wrong username or password');
			setNotificationColor('red');
			setTimeout(() => {
				setNotification(null);
				setNotificationColor(null);
			}, 5000);
		}
	};

	const handleLogout = () => {
		window.localStorage.clear();
		window.location.reload();
	};

	const handleCreation = async (e) => {
		e.preventDefault();

		try {
			const newBlog = await blogService.create({ title, author, url });
			setBlogs(blogs.concat(newBlog));
			setNotification(`a new blog ${newBlog.title} by ${newBlog.author}`);
			setNotificationColor('green');
			setTimeout(() => {
				setNotification(null);
				setNotificationColor(null);
			}, 5000);
		} catch (exception) {
			setNotification(exception);
			setNotificationColor('red');
			setTimeout(() => {
				setNotification(null);
				setNotificationColor(null);
			}, 5000);
		}
	};

	if (user === null) {
		return (
			<div>
				<h2>log in to application</h2>

				{notification && (
					<h2
						style={{
							backgroundColor: `${notificationColor}`,
						}}
					>
						{notification}
					</h2>
				)}

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
	}

	return (
		<>
			<div>
				<h2>create new</h2>

				{notification && (
					<h2
						style={{
							backgroundColor: `${notificationColor}`,
						}}
					>
						{notification}
					</h2>
				)}

				<form onSubmit={handleCreation}>
					<div>
						title:{' '}
						<input
							type="text"
							value={title}
							name="Title"
							onChange={({ target }) => setTitle(target.value)}
						/>
					</div>
					<div>
						author:{' '}
						<input
							type="text"
							value={author}
							name="Author"
							onChange={({ target }) => setAuthor(target.value)}
						/>
					</div>
					<div>
						url:{' '}
						<input
							type="text"
							value={url}
							name="Url"
							onChange={({ target }) => setUrl(target.value)}
						/>
					</div>
					<button type="submit">create</button>
				</form>
			</div>

			<div>
				<h2>blogs</h2>
				<p>
					{user.name} logged in <button onClick={handleLogout}>logout</button>
				</p>

				{blogs.map((blog) => (
					<Blog key={blog.id} blog={blog} />
				))}
			</div>
		</>
	);
};

export default App;
