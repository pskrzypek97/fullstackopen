import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { createBlog } from '../store/reducers/blogReducers';
import { setNotification } from '../store/reducers/notificationReducer';

import { Form, Button } from 'react-bootstrap';

const BlogForm = ({ blogFormRef }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [url, setUrl] = useState('');

    const dispatch = useDispatch();

    const handleCreation = async (e) => {
        e.preventDefault();

        try {
            dispatch(createBlog({ title, author, url }));
            blogFormRef.current.toggleVisibility();

            dispatch(
                setNotification(
                    {
                        message: `a new blog ${title} by ${author}`,
                        color: 'green',
                    },
                    5
                )
            );
        } catch (exception) {
            dispatch(setNotification({ message: exception, color: 'red' }, 5));
        }
        setTitle('');
        setAuthor('');
        setUrl('');
    };

    return (
        <div>
            <h2>create new</h2>

            <Form onSubmit={handleCreation}>
                <Form.Group>
                    <div>
                        <Form.Label>title: </Form.Label>
                        <Form.Control
                            id="title"
                            type="text"
                            value={title}
                            name="Title"
                            placeholder="Title"
                            onChange={({ target }) => setTitle(target.value)}
                        />
                    </div>
                    <div>
                        <Form.Label>author: </Form.Label>
                        <Form.Control
                            id="author"
                            type="text"
                            value={author}
                            name="Author"
                            placeholder="Author"
                            onChange={({ target }) => setAuthor(target.value)}
                        />
                    </div>
                    <div>
                        <Form.Label>url: </Form.Label>
                        <Form.Control
                            id="url"
                            type="text"
                            value={url}
                            name="Url"
                            placeholder="Url"
                            onChange={({ target }) => setUrl(target.value)}
                        />
                    </div>
                    <Button
                        variant="primary"
                        type="submit"
                        className="create-button"
                    >
                        create
                    </Button>
                </Form.Group>
            </Form>
        </div>
    );
};

export default BlogForm;
