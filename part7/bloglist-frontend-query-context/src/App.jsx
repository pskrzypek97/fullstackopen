import { useEffect, useState, useRef } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Routes, Route, useMatch } from 'react-router-dom';

import Blog from './components/Blog';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import UserList from './components/UserList';
import UserPage from './components/UserPage';
import BlogPage from './components/BlogPage';
import Navigation from './components/Navigation';

import blogService from './services/blog';
import userService from './services/users';
import { useNotificationValue } from './store/NotificationContext';
import { useUserValue, useUserDispatch } from './store/UserContext';

const App = () => {
	const [sortedBlogs, setSortedBlogs] = useState(null);
	const notification = useNotificationValue();
	const user = useUserValue();
	const userDispatch = useUserDispatch();
	const blogFormRef = useRef();

	const resultBlogs = useQuery({
		queryKey: ['blogs'],
		queryFn: blogService.getAll,
		refetchOnWindowFocus: focus,
	});

	const resultUsers = useQuery({
		queryKey: ['users'],
		queryFn: userService.getAll,
		refetchOnWindowFocus: focus,
	});

	const blogs = resultBlogs.data;
	const users = resultUsers.data;

	useEffect(() => {
		const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
		if (loggedUserJSON) {
			const user = JSON.parse(loggedUserJSON);
			userDispatch({ type: 'SET_USER', payload: user });
			blogService.setToken(user.token);
		}
	}, []);

	const handleLogout = () => {
		window.localStorage.clear();
		window.location.reload();
	};

	const sortBlogs = () => {
		setSortedBlogs([...blogs].sort((a, b) => b.likes - a.likes));
	};

	const matchUser = useMatch('/users/:id');
	const userObject = matchUser
		? users.find((u) => u.id === matchUser.params.id)
		: null;

	const matchBlog = useMatch('/blogs/:id');
	const blogObject = matchBlog
		? blogs.find((b) => b.id === matchBlog.params.id)
		: null;

	if (resultBlogs.isLoading) return <div>loading data...</div>;
	if (resultBlogs.isError) return <div>unable to fetch data</div>;

	if (user === null) {
		return (
			<div>
				{notification && <Notification />}

				<LoginForm />
			</div>
		);
	}

	return (
		<>
			<div>
				{notification && <Notification />}

				<Navigation />

				<h2>blogs</h2>

				<p>
					{user.name} logged in <button onClick={handleLogout}>logout</button>
				</p>

				<Routes>
					<Route
						path="/"
						element={
							<>
								<Togglable buttonLabel="new note" ref={blogFormRef}>
									<BlogForm blogFormRef={blogFormRef} />
								</Togglable>

								<br />
								<button onClick={sortBlogs}>sort blogs</button>

								{!sortedBlogs &&
									blogs.map((blog) => (
										<Blog key={blog.id} blog={blog} username={user.username} />
									))}

								{sortedBlogs &&
									sortedBlogs.map((b) => (
										<Blog key={b.id} blog={b} username={user.username} />
									))}
							</>
						}
					/>
					<Route path="/users" element={<UserList users={users} />} />
					<Route
						path="/users/:id"
						element={<UserPage userObject={userObject} />}
					/>
					<Route
						path="/blogs/:id"
						element={<BlogPage blog={blogObject} username={user.username} />}
					/>
				</Routes>
			</div>
		</>
	);
};

export default App;
