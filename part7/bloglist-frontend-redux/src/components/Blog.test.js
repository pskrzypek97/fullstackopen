import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

describe('<Blog/>', () => {
	let container;

	const mockHandler = jest.fn();

	beforeEach(() => {
		const blog = {
			title: 'mock title',
			author: 'mock author',
			url: 'mock url',
			likes: 2137,
		};

		container = render(
			<Blog blog={blog} username="mock" onLikes={mockHandler} />
		).container;
	});

	// 5.13
	test('renders title and author, does not render URL and number of likes', () => {
		expect(container).toHaveTextContent('mock title');
		expect(container).toHaveTextContent('mock author');
		expect(container).not.toHaveTextContent('mock url');
		expect(container).not.toHaveTextContent(2137);
	});

	// 5.14
	test('shows URL and number of likes when button controlling visibility is clicked', async () => {
		const user = userEvent.setup();
		const button = screen.getByText('view');
		await user.click(button);

		const div = container.querySelector('.moreInfo');
		expect(div).toHaveTextContent('mock url');
		expect(div).toHaveTextContent(2137);
	});

	// 5.15
	test('clicking likes button twice calls an event handler function twice', async () => {
		const user = userEvent.setup();
		const button = screen.getByText('view');
		await user.click(button);

		const likeButton = container.querySelector('.like');
		await user.click(likeButton);
		await user.click(likeButton);

		expect(mockHandler.mock.calls).toHaveLength(2);
	});
});
