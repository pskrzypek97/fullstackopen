import { useState } from 'react';

import PropTypes from 'prop-types';

import blogService from '../services/blogs';

const Blog = ({ blog, username, onLikes }) => {
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

			await onLikes(blog, likes);
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
				<div className="moreInfo">
					<br />
					{blog.url}
					<br />
					likes {likes}{' '}
					<button onClick={updateLikes} className="like">
						like
					</button>
					<br />
					{blog?.user?.name}
					<br />
					{blog?.user?.username === username && (
						<button onClick={removeBlog}>remove</button>
					)}
				</div>
			)}
		</div>
	);
};

Blog.propTypes = {
	blog: PropTypes.object.isRequired,
	username: PropTypes.string.isRequired,
	onLikes: PropTypes.func.isRequired,
};

export default Blog;
