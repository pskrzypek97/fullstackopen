import { useState, useEffect, useRef } from 'react';

import Blog from './components/Blog';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';

import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
	const [blogs, setBlogs] = useState([]);
	const [user, setUser] = useState(null);
	const [notification, setNotification] = useState(null);
	const [notificationColor, setNotificationColor] = useState(null);

	const blogFormRef = useRef();

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

	const handleLogin = async (loginObject) => {
		try {
			const user = await loginService.login(loginObject);

			window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
			blogService.setToken(user.token);
			setUser(user);
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

	const handleCreation = async (blogObject) => {
		try {
			const newBlog = await blogService.create(blogObject);
			blogFormRef.current.toggleVisibility();
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

	const handleLikes = async (blog, likes) => {
		await blogService.update(blog.id, { ...blog, likes: likes + 1 });
	};

	const sortBlogs = () => {
		const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
		setBlogs(sortedBlogs);
	};

	if (user === null) {
		return (
			<div>
				{notification && (
					<h2
						style={{
							backgroundColor: `${notificationColor}`,
						}}
					>
						{notification}
					</h2>
				)}

				<LoginForm onLogin={handleLogin} />
			</div>
		);
	}

	return (
		<>
			<div>
				{notification && (
					<h2
						style={{
							backgroundColor: `${notificationColor}`,
						}}
					>
						{notification}
					</h2>
				)}

				<h2>blogs</h2>

				<p>
					{user.name} logged in <button onClick={handleLogout}>logout</button>
				</p>

				<Togglable buttonLabel="new note" ref={blogFormRef}>
					<BlogForm
						onCreation={handleCreation}
						notification={notification}
						notificationColor={notificationColor}
					/>
				</Togglable>

				<br />
				<button onClick={sortBlogs}>sort blogs</button>

				{blogs.map((blog) => (
					<Blog
						key={blog.id}
						blog={blog}
						username={user.username}
						onLikes={handleLikes}
					/>
				))}
			</div>
		</>
	);
};

export default App;
