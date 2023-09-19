import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogForm from './BlogForm';

// 5.16
test('<BlogForm/> calls the event handler when a new blog is created', async () => {
	const createBlog = jest.fn();
	const user = userEvent.setup();

	render(<BlogForm onCreation={createBlog} />);

	const titleInput = screen.getByPlaceholderText('Title');
	const authorInput = screen.getByPlaceholderText('Author');
	const urlInput = screen.getByPlaceholderText('Url');
	const createButton = screen.getByText('create');

	await user.type(titleInput, 'Mock title');
	await user.type(authorInput, 'Mock author');
	await user.type(urlInput, 'Mock URL');
	await user.click(createButton);

	expect(createBlog.mock.calls).toHaveLength(1);
	expect(createBlog.mock.calls[0][0].title).toBe('Mock title');
	expect(createBlog.mock.calls[0][0].author).toBe('Mock author');
	expect(createBlog.mock.calls[0][0].url).toBe('Mock URL');
});
