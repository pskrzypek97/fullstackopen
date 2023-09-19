import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { voteBlog, deleteBlog } from '../store/reducers/blogReducers';
import { setNotification } from '../store/reducers/notificationReducer';

const BlogPage = ({ blog, username }) => {
    if (!blog) return null;

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
        </>
    );
};

export default BlogPage;
