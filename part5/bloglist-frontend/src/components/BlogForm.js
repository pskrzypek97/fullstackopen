import { useState } from 'react';

const BlogForm = ({ onCreation }) => {
	const [title, setTitle] = useState('');
	const [author, setAuthor] = useState('');
	const [url, setUrl] = useState('');

	const addBlog = (e) => {
		e.preventDefault();

		onCreation({ title, author, url });
		setTitle('');
		setAuthor('');
		setUrl('');
	};

	return (
		<div>
			<h2>create new</h2>

			<form onSubmit={addBlog}>
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
