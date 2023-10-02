import { useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import PropTypes from 'prop-types';
import { TextField, Button } from '@mui/material';

import blogService from '../services/blog';
import { useNotificationDispatch } from '../store/NotificationContext';

const BlogForm = ({ blogFormRef }) => {
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');
	const [url, setUrl] = useState('');

	const queryClient = useQueryClient();

	const notificationDispatch = useNotificationDispatch();

	const newBlogMutation = useMutation({
		mutationFn: blogService.create,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] }),
	});

	const addBlog = (e) => {
		e.preventDefault();
		try {
			newBlogMutation.mutate({ title, author, url });
			blogFormRef.current.toggleVisibility();
			notificationDispatch({
				type: 'CREATE',
				payload: {
					value: `a new blog ${title} by ${author}`,
					severity: 'success',
				},
			});
			setTimeout(() => {
				notificationDispatch({ type: 'REMOVE' });
			}, 5000);
		} catch (exception) {
			notificationDispatch({
				type: 'CREATE',
				payload: { value: exception, severity: 'error' },
			});
			setTimeout(() => {
				notificationDispatch({ type: 'REMOVE' });
			}, 5000);
		}
		setTitle('');
		setAuthor('');
		setUrl('');
	};

	return (
		<div>
			<h2>create new</h2>

			<form onSubmit={addBlog}>
				<div>
					<label htmlFor="title">title: </label>
					<TextField
						id="title"
						type="text"
						value={title}
						name="Title"
						placeholder="Title"
						onChange={({ target }) => setTitle(target.value)}
					/>
				</div>
				<div>
					<label htmlFor="author">author: </label>
					<TextField
						id="author"
						type="text"
						value={author}
						name="Author"
						placeholder="Author"
						onChange={({ target }) => setAuthor(target.value)}
					/>
				</div>
				<div>
					<label htmlFor="url">url: </label>
					<TextField
						id="url"
						type="text"
						value={url}
						name="Url"
						placeholder="Url"
						onChange={({ target }) => setUrl(target.value)}
					/>
				</div>
				<Button variant="contained" type="submit" className="create-button">
					create
				</Button>
			</form>
		</div>
	);
};

BlogForm.propTypes = {
	blogFormRef: PropTypes.object.isRequired,
};

export default BlogForm;
