import { useState, useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { voteBlog, deleteBlog } from '../store/reducers/blogReducers';
import { setNotification } from '../store/reducers/notificationReducer';

import blogService from '../services/blogs';

const BlogPage = ({ blog, username }) => {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => setComments(blog?.comments), []);

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const updateLikes = async () => {
        try {
            dispatch(voteBlog(blog));

            dispatch(
                setNotification(
                    { message: `blog ${blog.title} is liked`, color: 'green' },
                    5
                )
            );
        } catch (e) {
            console.error(e);
        }
    };

    const removeBlog = async () => {
        try {
            if (
                window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
            ) {
                dispatch(deleteBlog(blog.id));
                dispatch(
                    setNotification(
                        {
                            message: `removed ${blog.title} blog`,
                            color: 'green',
                        },
                        5
                    )
                );
                navigate('/');
            }
        } catch (e) {
            console.log(e);
        }
    };

    const handleComments = async (e) => {
        e.preventDefault();

        try {
            const savedComment = await blogService.comment(blog.id, {
                ...blog,
                comment,
            });

            setComments(comments.concat(savedComment));
        } catch (exception) {
            console.log(exception);
        }

        setComment('');
    };

    if (!blog) return null;

    return (
        <>
            <h3>{blog.title}</h3>
            <a href={blog.url}>{blog.url}</a>
            <div>
                {blog.likes} likes <button onClick={updateLikes}>like</button>
            </div>
            <div>added by {blog.author}</div>
            {blog.user?.username === username && (
                <div>
                    <button onClick={removeBlog}>remove</button>
                </div>
            )}
            <br />

            <b>comments</b>
            <br />
            <form onSubmit={handleComments}>
                <input
                    id="comment"
                    type="text"
                    value={comment}
                    name="Comment"
                    placeholder="Comment"
                    onChange={({ target }) => setComment(target.value)}
                />
                <button>add comment</button>
            </form>
            <ul>
                {comments &&
                    comments.map((c) => <li key={c.id}>{c.comment}</li>)}
            </ul>
        </>
    );
};

export default BlogPage;
