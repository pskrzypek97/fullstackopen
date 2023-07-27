const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const helper = require('./test_helper');

const api = supertest(app);
const Blog = require('../models/blog');
const User = require('../models/user');

beforeEach(async () => {
	await Blog.deleteMany({});

	const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog));
	const promiseArray = blogObjects.map((blog) => blog.save());
	await Promise.all(promiseArray);

	await User.deleteMany({});

	const passwordHash = await bcrypt.hash('sekret', 10);
	const user = new User({ username: 'root', name: 'Przemek', passwordHash });

	await user.save();
});

describe('when there is initially some blogs saved', () => {
	//4.8
	test('blogs are returned as json in the correct number', async () => {
		const response = await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(response.body).toHaveLength(helper.initialBlogs.length);
	});

	//4.9
	test('blogs identifiers are called id', async () => {
		const blogs = await helper.blogsInDB();

		expect(blogs[0].id).toBeDefined();
	});
});

describe('addition of a new blog', () => {
	//4.10
	test('succeeds if new blog post is in a correct format', async () => {
		const login = await api
			.post('/api/login')
			.send({ username: 'root', password: 'sekret' });

		const newBlogPost = {
			title: 'About Fullstack Development',
			author: 'Przemek',
			url: 'made-up-url.com',
			likes: 5,
		};

		await api
			.post('/api/blogs')
			.set('Authorization', `bearer ${login.body.token}`)
			.send(newBlogPost)
			.expect(201)
			.expect('Content-Type', /application\/json/);

		const blogsAtEnd = await helper.blogsInDB();
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

		const titles = blogsAtEnd.map((r) => r.title);
		expect(titles).toContain('About Fullstack Development');
	});

	//4.11
	test('succeeds if likes property is missing and adds value 0 to it', async () => {
		const login = await api
			.post('/api/login')
			.send({ username: 'root', password: 'sekret' });

		const newBlogPost = {
			title: 'About Frontend Development',
			author: 'Przemek',
			url: 'made-up-url.com',
		};

		const response = await api
			.post('/api/blogs')
			.set('Authorization', `bearer ${login.body.token}`)
			.send(newBlogPost)
			.expect(201);

		expect(response.body.likes).toBe(0);
	});

	//4.12
	test('fails with code 400 if title is missing', async () => {
		const login = await api
			.post('/api/login')
			.send({ username: 'root', password: 'sekret' });

		const newBlogPost = {
			author: 'Przemek',
			url: 'made-up-url.com',
			likes: 10,
		};

		await api
			.post('/api/blogs')
			.set('Authorization', `bearer ${login.body.token}`)
			.send(newBlogPost)
			.expect(400);

		const blogsAtEnd = await helper.blogsInDB();

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
	});

	test('fails with code 400 if url is missing', async () => {
		const login = await api
			.post('/api/login')
			.send({ username: 'root', password: 'sekret' });

		const newBlogPost = {
			title: 'About Backend Development',
			author: 'Przemek',
			likes: 15,
		};

		await api
			.post('/api/blogs')
			.set('Authorization', `bearer ${login.body.token}`)
			.send(newBlogPost)
			.expect(400);

		const blogsAtEnd = await helper.blogsInDB();

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
	});

	test('fails with code 401 if token is not provided', async () => {
		const newBlogPost = {
			title: 'About Fullstack Development',
			author: 'Przemek',
			url: 'made-up-url.com',
			likes: 5,
		};

		await api.post('/api/blogs').send(newBlogPost).expect(401);

		const blogsAtEnd = await helper.blogsInDB();

		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
	});
});

//4.13
describe('deletion of blog', () => {
	test('succeeds with code 204 if id is correct', async () => {
		const login = await api
			.post('/api/login')
			.send({ username: 'root', password: 'sekret' });

		const newBlogPost = {
			title: 'About Fullstack Development',
			author: 'Przemek',
			url: 'made-up-url.com',
			likes: 5,
		};

		await api
			.post('/api/blogs')
			.set('Authorization', `bearer ${login.body.token}`)
			.send(newBlogPost);

		const blogsAtStart = await helper.blogsInDB();
		const blogToDelete = blogsAtStart[blogsAtStart.length - 1];

		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.set('Authorization', `bearer ${login.body.token}`)
			.expect(204);

		const blogsAtEnd = await helper.blogsInDB();
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);

		const titles = blogsAtEnd.map((blog) => blog.title);
		expect(titles).not.toContain(blogToDelete.title);
	});

	test('fails with code 400 if id is incorrect', async () => {
		const login = await api
			.post('/api/login')
			.send({ username: 'root', password: 'sekret' });

		const incorrectId = '12414123dqddsd2ed1d1';

		await api
			.delete(`/api/blogs/${incorrectId}`)
			.set('Authorization', `bearer ${login.body.token}`)
			.expect(400);

		const blogsAtEnd = await helper.blogsInDB();
		expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length);
	});
});

//4.14
describe('update of blog', () => {
	test('succeeds with status 200 if id is valid', async () => {
		const blogsAtStart = await helper.blogsInDB();
		const blogToUpdate = blogsAtStart[0];

		const updatedNote = {
			title: blogToUpdate.title,
			author: blogToUpdate.author,
			url: blogToUpdate.url,
			likes: 125,
		};

		await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.send(updatedNote)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		const blogsAtEnd = await helper.blogsInDB();
		const updatedBlog = blogsAtEnd[0];
		expect(updatedBlog.id).toBe(blogToUpdate.id);
		expect(updatedBlog.likes).not.toBe(blogToUpdate.likes);
	});

	test('fails with status code 400 if id is incorrect', async () => {
		const invalidId = '2131312dqw121e1e121';

		const updatedNote = {
			title: "Przemek's Blog",
			author: 'Przemek',
			url: 'made-up-url2.com',
			likes: 125,
		};

		await api.put(`/api/blogs/${invalidId}`).send(updatedNote).expect(400);
	});
});

describe('when there is initially one user in db', () => {
	test('creation succeeds with a fresh username', async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: 'mluukkai',
			name: 'Matti Luukkainen',
			password: 'salainen',
		};

		await api
			.post('/api/users')
			.send(newUser)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

		const usernames = usersAtEnd.map((u) => u.username);
		expect(usernames).toContain(newUser.username);
	});

	test('creation fails with proper statuscode and message if username already taken', async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: 'root',
			name: 'Superuser',
			password: 'salainen',
		};

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		expect(result.body.error).toContain('expected `username` to be unique');

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toEqual(usersAtStart);
	});

	test('creation fails with proper statuscode and message if username is shorter than 3 characters long', async () => {
		const usersAtStart = await helper.usersInDb();

		const newUser = {
			username: 'te',
			name: 'Superuser',
			password: 'salainen',
		};

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		expect(result.body.error).toContain(
			'is shorter than the minimum allowed length (3).'
		);

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toEqual(usersAtStart);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
});
