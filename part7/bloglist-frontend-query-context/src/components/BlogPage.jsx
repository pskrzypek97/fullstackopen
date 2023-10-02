import { useState } from 'react';

import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
	TextField,
	Button,
	List,
	ListItemText,
	Box,
	Divider,
} from '@mui/material';

import blogService from '../services/blog';
import { useNotificationDispatch } from '../store/NotificationContext';

const BlogPage = ({ blog, username }) => {
	const [comment, setComment] = useState('');

	const navigate = useNavigate();

	const queryClient = useQueryClient();

	const notificationDispatch = useNotificationDispatch();

	const updateBlogMutation = useMutation({
		mutationFn: blogService.update,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] }),
	});

	const deleteBlogMutation = useMutation({
		mutationFn: blogService.deleteBlog,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] }),
	});

	const addCommentMutation = useMutation({
		mutationFn: blogService.comment,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] }),
	});

	const updateLikes = async () => {
		try {
			updateBlogMutation.mutate({ ...blog, likes: blog.likes + 1 });
			notificationDispatch({
				type: 'CREATE',
				payload: { value: `liked ${blog.title}`, severity: 'success' },
			});
			setTimeout(() => {
				notificationDispatch({ type: 'REMOVE' });
			}, 5000);
		} catch (e) {
			console.log(e);
		}
	};

	const removeBlog = async () => {
		try {
			if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
				deleteBlogMutation.mutate(blog.id);
				navigate('/');
				notificationDispatch({
					type: 'CREATE',
					payload: { value: `removed ${blog.title}`, severity: 'success' },
				});
				setTimeout(() => {
					notificationDispatch({ type: 'REMOVE' });
				}, 5000);
			}
		} catch (e) {
			console.log(e);
		}
	};

	const handleComments = async (e) => {
		e.preventDefault();

		try {
			addCommentMutation.mutate({ ...blog, comment });

			notificationDispatch({
				type: 'CREATE',
				payload: {
					value: `added comment ${comment} to ${blog.title}`,
					severity: 'success',
				},
			});
			setTimeout(() => {
				notificationDispatch({ type: 'REMOVE' });
			}, 5000);
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
				{blog.likes} likes <Button onClick={updateLikes}>like</Button>
			</div>
			<div>added by {blog.author}</div>
			{blog.user?.username === username && (
				<div>
					<Button onClick={removeBlog}>remove</Button>
				</div>
			)}
			<br />

			<b>comments</b>
			<br />
			<form onSubmit={handleComments}>
				<TextField
					id="comment"
					type="text"
					value={comment}
					name="Comment"
					placeholder="Comment"
					onChange={({ target }) => setComment(target.value)}
				/>
				<Button type="submit">add comment</Button>
			</form>
			<Box>
				<List>
					{blog.comments &&
						blog.comments.map((c) => (
							<div key={c.id}>
								<ListItemText primary={c.comment} />
								<Divider />
							</div>
						))}
				</List>
			</Box>
		</>
	);
};

BlogPage.propTypes = {
	blog: PropTypes.object,
	username: PropTypes.string.isRequired,
};

export default BlogPage;
