const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);
const Blog = require('../models/blog');

const blogs = [
	{
		_id: '5a422a851b54a676234d17f7',
		title: 'React patterns',
		author: 'Michael Chan',
		url: 'https://reactpatterns.com/',
		likes: 7,
		__v: 0,
	},
	{
		_id: '5a422aa71b54a676234d17f8',
		title: 'Go To Statement Considered Harmful',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		likes: 5,
		__v: 0,
	},
	{
		_id: '5a422b3a1b54a676234d17f9',
		title: 'Canonical string reduction',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
		likes: 12,
		__v: 0,
	},
	{
		_id: '5a422b891b54a676234d17fa',
		title: 'First class tests',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
		likes: 10,
		__v: 0,
	},
	{
		_id: '5a422ba71b54a676234d17fb',
		title: 'TDD harms architecture',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
		likes: 0,
		__v: 0,
	},
	{
		_id: '5a422bc61b54a676234d17fc',
		title: 'Type wars',
		author: 'Robert C. Martin',
		url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
		likes: 2,
		__v: 0,
	},
];

beforeEach(async () => {
	await Blog.deleteMany({});

	const blogObjects = blogs.map((blog) => new Blog(blog));
	const promiseArray = blogObjects.map((blog) => blog.save());
	await Promise.all(promiseArray);
});

//4.8
test('blogs are returned as json in the correct number', async () => {
	const response = await api
		.get('/api/blogs')
		.expect(200)
		.expect('Content-Type', /application\/json/);

	expect(response.body).toHaveLength(blogs.length);
});

//4.9
test('blogs identifiers are called id', async () => {
	const response = await api.get('/api/blogs');

	expect(response.body[0].id).toBeDefined();
});

//4.10
test('valid blog post can be added', async () => {
	const newBlogPost = {
		title: 'About Fullstack Development',
		author: 'Przemek',
		url: 'made-up-url.com',
		likes: 5,
	};

	await api
		.post('/api/blogs')
		.send(newBlogPost)
		.expect(201)
		.expect('Content-Type', /application\/json/);

	const response = await api.get('/api/blogs');
	expect(response.body).toHaveLength(blogs.length + 1);

	const titles = response.body.map((r) => r.title);
	expect(titles).toContain('About Fullstack Development');
});

//4.11
test('missing likes property will default to 0', async () => {
	const newBlogPost = {
		title: 'About Frontend Development',
		author: 'Przemek',
		url: 'made-up-url.com',
	};

	const response = await api.post('/api/blogs').send(newBlogPost).expect(201);

	expect(response.body.likes).toBe(0);
});

//4.12
test('missing title returns 400 status code', async () => {
	const newBlogPost = {
		author: 'Przemek',
		url: 'made-up-url.com',
		likes: 10,
	};

	await api.post('/api/blogs').send(newBlogPost).expect(400);

	const response = await api.get('/api/blogs');

	expect(response.body).toHaveLength(blogs.length);
});

test('missing url returns 400 status code', async () => {
	const newBlogPost = {
		title: 'About Backend Development',
		author: 'Przemek',
		likes: 15,
	};

	await api.post('/api/blogs').send(newBlogPost).expect(400);

	const response = await api.get('/api/blogs');

	expect(response.body).toHaveLength(blogs.length);
});

afterAll(async () => {
	await mongoose.connection.close();
});
