import { useEffect, useState, useRef } from 'react';

import { useQuery } from '@tanstack/react-query';
import { Routes, Route, useMatch } from 'react-router-dom';
import { Container, Button, Box } from '@mui/material';

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

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
			<Container>
				{notification && <Notification />}

				<LoginForm />
			</Container>
		);
	}

	return (
		<Container>
			<Navigation />

			{notification && <Notification />}

			<h2>Blogs</h2>

			<Routes>
				<Route
					path="/"
					element={
						<>
							<Togglable buttonLabel="new note" ref={blogFormRef}>
								<BlogForm blogFormRef={blogFormRef} />
							</Togglable>

							<br />
							<Button variant="outlined" onClick={sortBlogs}>
								sort blogs
							</Button>

							<Box>
								{!sortedBlogs &&
									blogs.map((blog) => (
										<Blog key={blog.id} blog={blog} username={user.username} />
									))}

								{sortedBlogs &&
									sortedBlogs.map((b) => (
										<Blog key={b.id} blog={b} username={user.username} />
									))}
							</Box>
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
		</Container>
	);
};

export default App;
