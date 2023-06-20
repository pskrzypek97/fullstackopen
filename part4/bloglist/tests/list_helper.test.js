const listHelper = require('../utils/list_helper');

const listWithOneBlog = [
	{
		_id: '5a422aa71b54a676234d17f8',
		title: 'Go To Statement Considered Harmful',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		likes: 5,
		__v: 0,
	},
];

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

// 4.3
test('dummy returns one', () => {
	const blogs = [];

	const result = listHelper.dummy(blogs);

	expect(result).toBe(1);
});

// 4.4
describe('total likes', () => {
	test('of empty list is zero', () => {
		expect(listHelper.totalLikes([])).toBe(0);
	});

	test('when list has only one blog, equals the likes of that', () => {
		const result = listHelper.totalLikes(listWithOneBlog);

		expect(result).toBe(5);
	});

	test('of a bigger list is calculated right', () => {
		const result = listHelper.totalLikes(blogs);

		expect(result).toBe(36);
	});
});

// 4.5
describe('favorite blog is', () => {
	test('zero if blog list is empty', () => {
		expect(listHelper.totalLikes([])).toBe(0);
	});

	test('the only blog, if the blog list has only one position', () => {
		const result = listHelper.favoriteBlog(listWithOneBlog);

		expect(result).toEqual(listWithOneBlog[0]);
	});

	test('a blog with highest number of likes', () => {
		const result = listHelper.favoriteBlog(blogs);

		expect(result).toEqual(blogs[2]);
	});
});

// 4.6
describe('most blogs is', () => {
	test('zero if blog list is empty', () => {
		expect(listHelper.mostBlogs([])).toBe(0);
	});

	test('the only author when blog list length is one', () => {
		expect(listHelper.mostBlogs(listWithOneBlog)).toEqual({
			author: 'Edsger W. Dijkstra',
			blogs: 1,
		});
	});

	test('the author of most blogs if the blog list contains many blogs', () => {
		expect(listHelper.mostBlogs(blogs)).toEqual({
			author: 'Robert C. Martin',
			blogs: 3,
		});
	});
});

// 4.7
describe('most likes is', () => {
	test('zero if blog list is empty', () => {
		expect(listHelper.mostLikes([])).toBe(0);
	});

	test('the count of one author if the blog list length is 1', () => {
		expect(listHelper.mostLikes(listWithOneBlog)).toEqual({
			author: 'Edsger W. Dijkstra',
			likes: 5,
		});
	});

	test('the count of likes of the most popular author', () => {
		expect(listHelper.mostLikes(blogs)).toEqual({
			author: 'Robert C. Martin',
			likes: 12,
		});
	});
});
