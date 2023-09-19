import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { createBlog } from '../store/reducers/blogReducers';
import { setNotification } from '../store/reducers/notificationReducer';

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

            <form onSubmit={handleCreation}>
                <div>
                    title:{' '}
                    <input
                        id="title"
                        type="text"
                        value={title}
                        name="Title"
                        placeholder="Title"
                        onChange={({ target }) => setTitle(target.value)}
                    />
                </div>
                <div>
                    author:{' '}
                    <input
                        id="author"
                        type="text"
                        value={author}
                        name="Author"
                        placeholder="Author"
                        onChange={({ target }) => setAuthor(target.value)}
                    />
                </div>
                <div>
                    url:{' '}
                    <input
                        id="url"
                        type="text"
                        value={url}
                        name="Url"
                        placeholder="Url"
                        onChange={({ target }) => setUrl(target.value)}
                    />
                </div>
                <button type="submit" className="create-button">
                    create
                </button>
            </form>
        </div>
    );
};

export default BlogForm;
