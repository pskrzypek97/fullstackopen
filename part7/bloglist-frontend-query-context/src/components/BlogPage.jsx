import { useState, useEffect } from 'react';

import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import blogService from '../services/blog';

const BlogPage = ({ blog, username }) => {
	const [comments, setComments] = useState([]);
	const [comment, setComment] = useState('');

	useEffect(() => setComments(blog?.comments), []);

	const navigate = useNavigate();

	const queryClient = useQueryClient();

	const updateBlogMutation = useMutation({
		mutationFn: blogService.update,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] }),
	});

	const deleteBlogMutation = useMutation({
		mutationFn: blogService.deleteBlog,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['blogs'] }),
	});

	const updateLikes = async () => {
		try {
			updateBlogMutation.mutate({ ...blog, likes: blog.likes + 1 });
		} catch (e) {
			console.log(e);
		}
	};

	const removeBlog = async () => {
		try {
			if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
				deleteBlogMutation.mutate(blog.id);
			}
		} catch (e) {
			console.log(e);
		}
	};

	// const handleComments = async (e) => {
	// 	e.preventDefault();

	// 	try {
	// 		const savedComment = await blogService.comment(blog.id, {
	// 			...blog,
	// 			comment,
	// 		});

	// 		setComments(comments.concat(savedComment));

	// 		dispatch(
	// 			setNotification(
	// 				{
	// 					message: `you commented ${blog.title} by ${blog.author}`,
	// 					variant: 'success',
	// 				},
	// 				5
	// 			)
	// 		);
	// 	} catch (exception) {
	// 		console.log(exception);
	// 	}

	// 	setComment('');
	// };

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
			{/* <form onSubmit={handleComments}>
				<input
					id="comment"
					type="text"
					value={comment}
					name="Comment"
					placeholder="Comment"
					onChange={({ target }) => setComment(target.value)}
				/>
				<button type="submit">add comment</button>
			</form> */}
			<ul>
				{comments && comments.map((c) => <li key={c.id}>{c.comment}</li>)}
			</ul>
		</>
	);
};

export default BlogPage;
