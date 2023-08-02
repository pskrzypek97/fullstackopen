import { useState } from 'react';

import PropTypes from 'prop-types';

import blogService from '../services/blogs';

const Blog = ({ blog, username }) => {
	const [visible, setVisible] = useState(false);
	const [likes, setLikes] = useState(blog.likes);

	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: 'solid',
		borderWidth: 1,
		marginBottom: 5,
	};

	const updateLikes = async () => {
		try {
			setLikes((prevLike) => prevLike + 1);

			await blogService.update(blog.id, { ...blog, likes: likes + 1 });
		} catch (e) {
			setLikes(blog.likes);
		}
	};

	const removeBlog = async () => {
		try {
			if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
				await blogService.deleteBlog(blog.id);
			}
		} catch (e) {
			console.log(e);
		}
	};

	return (
		<div style={blogStyle}>
			{blog.title} by {blog.author}
			<button onClick={() => setVisible(!visible)}>
				{visible ? 'hide' : 'view'}
			</button>
			{visible && (
				<>
					<br />
					{blog.url}
					<br />
					likes {likes} <button onClick={updateLikes}>like</button>
					<br />
					{blog?.user?.name}
					<br />
					{blog?.user?.username === username && (
						<button onClick={removeBlog}>remove</button>
					)}
				</>
			)}
		</div>
	);
};

Blog.propTypes = {
	blog: PropTypes.object.isRequired,
	username: PropTypes.string.isRequired,
};

export default Blog;
