import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const Blog = ({ blog }) => {
	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: 'solid',
		borderWidth: 1,
		marginBottom: 5,
	};

	return (
		<div style={blogStyle} className="blog">
			<span>
				<Link to={`/blogs/${blog.id}`}>
					{blog.title} by {blog.author}
				</Link>
			</span>
		</div>
	);
};

Blog.propTypes = {
	blog: PropTypes.object.isRequired,
	username: PropTypes.string.isRequired,
};

export default Blog;
