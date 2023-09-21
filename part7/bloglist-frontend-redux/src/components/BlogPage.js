import { useState, useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Button, Form, ListGroup } from 'react-bootstrap';

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
                    {
                        message: `blog ${blog.title} is liked`,
                        variant: 'success',
                    },
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
                            variant: 'success',
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

            dispatch(
                setNotification(
                    {
                        message: `you commented ${blog.title} by ${blog.author}`,
                        variant: 'success',
                    },
                    5
                )
            );
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
                {blog.likes} likes{' '}
                <Button variant="success" onClick={updateLikes}>
                    like
                </Button>
            </div>
            <div>added by {blog.author}</div>
            {blog.user?.username === username && (
                <div>
                    <Button variant="danger" onClick={removeBlog}>
                        remove
                    </Button>
                </div>
            )}
            <br />

            <b>comments</b>
            <br />
            <Form onSubmit={handleComments}>
                <Form.Control
                    id="comment"
                    type="text"
                    value={comment}
                    name="Comment"
                    placeholder="Comment"
                    onChange={({ target }) => setComment(target.value)}
                />
                <Button type="submit">add comment</Button>
            </Form>
            <ListGroup>
                {comments &&
                    comments.map((c) => (
                        <ListGroup.Item key={c.id}>{c.comment}</ListGroup.Item>
                    ))}
            </ListGroup>
        </>
    );
};

export default BlogPage;
