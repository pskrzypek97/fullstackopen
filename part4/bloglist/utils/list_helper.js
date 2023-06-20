const dummy = (blogs) => {
	return 1;
};

const totalLikes = (blogs) => {
	if (!blogs.length) return 0;

	const numberOfLikes = blogs.reduce((acc, blog) => acc + blog.likes, 0);

	return numberOfLikes;
};

const favoriteBlog = (blogs) => {
	if (!blogs.length) return 0;

	const mostLikes = blogs.reduce((acc, blog) => {
		return blog.likes > acc ? (acc = blog.likes) : acc;
	}, 0);

	return blogs.find((blog) => blog.likes === mostLikes);
};

const mostBlogs = (blogs) => {
	if (!blogs.length) return 0;

	const authors = [...new Set(blogs.map((blog) => blog.author))];
	const blogsCount = Array(authors.length).fill(0);

	blogs.forEach((blog) => {
		authors.forEach((author, i) => {
			if (blog.author === author) blogsCount[i]++;
		});
	});

	const indexOfMostBlogs = blogsCount.indexOf(Math.max(...blogsCount));

	return {
		author: authors[indexOfMostBlogs],
		blogs: blogsCount[indexOfMostBlogs],
	};
};

const mostLikes = (blogs) => {
	if (!blogs.length) return 0;

	const { author } = mostBlogs(blogs);

	const likesCount = blogs.reduce(
		(acc, blog) => (blog.author === author ? acc + blog.likes : acc),
		0
	);

	return { author, likes: likesCount };
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };
