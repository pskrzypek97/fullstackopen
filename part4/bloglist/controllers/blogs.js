const blogsRouter = require('express').Router();
const { userExtractor } = require('../utils/middleware');
const Blog = require('../models/blog');
const Comment = require('../models/comment');

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({})
		.populate('user', { username: 1, name: 1 })
		.populate('comments', { comment: 1 });
	response.json(blogs);
});

blogsRouter.post('/', userExtractor, async (request, response) => {
	const body = request.body;
	const user = request.user;

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes || 0,
		user: user.id,
	});

	const savedBlog = await blog.save();
	user.blogs = user.blogs.concat(savedBlog._id);
	await user.save();

	response.status(201).json(savedBlog);
});

blogsRouter.post('/:id/comments', async (request, response) => {
	const body = request.body;

	const blog = await Blog.findById(body.id);

	const comment = new Comment({
		comment: body.comment,
		blog: blog._id,
	});

	const savedComment = await comment.save();

	blog.comments = blog.comments.concat(savedComment._id);
	await blog.save();

	response.status(201).json(savedComment);
});

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
	const user = request.user;
	const blog = await Blog.findById(request.params.id);

	if (!(user.id.toString() === blog.user.toString())) {
		response.status(400).json({ error: 'invalid token' });
	}

	await Blog.findByIdAndDelete(request.params.id);
	response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
	const body = request.body;

	const blog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
	};

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
		new: true,
	});
	response.json(updatedBlog);
});

module.exports = blogsRouter;
