import { useState, useEffect, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { Routes, Route, useMatch } from 'react-router-dom';

import { initializeBlogs, setBlogs } from './store/reducers/blogReducers';
import { setUser } from './store/reducers/userReducers';

import Blog from './components/Blog';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import UserList from './components/UserList';
import UserPage from './components/UserPage';
import BlogPage from './components/BlogPage';
import Navigation from './components/Navigation';

import blogService from './services/blogs';
import usersService from './services/users';

const App = () => {
    const [users, setUsers] = useState([]);

    const blogs = useSelector((state) => state.blog);
    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const blogFormRef = useRef();

    useEffect(() => {
        dispatch(initializeBlogs());
    }, []);

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            dispatch(setUser(user));
            blogService.setToken(user.token);
        }
    }, []);

    useEffect(() => {
        usersService.getAll().then((res) => setUsers(res));
    }, []);

    const sortBlogs = () => {
        const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
        dispatch(setBlogs(sortedBlogs));
    };

    const matchUser = useMatch('/users/:id');
    const userObject = matchUser
        ? users.find((u) => u.id === matchUser.params.id)
        : null;

    const matchBlog = useMatch('/blogs/:id');
    const blogObject = matchBlog
        ? blogs.find((b) => b.id === matchBlog.params.id)
        : null;

    if (user === null) {
        return (
            <div>
                <Notification />

                <LoginForm />
            </div>
        );
    }

    return (
        <div>
            <Navigation />

            <Notification />

            <h1>blog app</h1>

            <Routes>
                <Route
                    path="/"
                    element={
                        <>
                            <h2>Blogs</h2>

                            <Togglable buttonLabel="new blog" ref={blogFormRef}>
                                <BlogForm blogFormRef={blogFormRef} />
                            </Togglable>

                            <br />
                            <button onClick={sortBlogs}>sort blogs</button>

                            {blogs.map((blog) => (
                                <Blog key={blog.id} blog={blog} />
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
                    element={
                        <BlogPage blog={blogObject} username={user.username} />
                    }
                />
            </Routes>
        </div>
    );
};

export default App;
