const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { GraphQLError } = require('graphql');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Book = require('./models/book');
const Author = require('./models/author');
const User = require('./models/user');

mongoose.set('strictQuery', false);

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log('connecting to', MONGODB_URI);

mongoose
	.connect(MONGODB_URI)
	.then(() => console.log('connected to MongoDB'))
	.catch((error) => console.log('error connection to MongoDB:', error.message));

const typeDefs = `
	type User {
		username: String!
		favoriteGenre: String!
		id: ID!
  	}
  
  	type Token {
		value: String!
  	}

    type Author {
        name: String!
        born: Int
		bookCount: Int
        id: ID!
    }

    type Book {
        title: String!
        published: Int!
        author: Author!
        id: ID!
        genres: [String!]!
    }

    type Query {
        bookCount: Int!
        authorCount: Int!
        allBooks(author: String, genre: String): [Book!]!
        allAuthors: [Author!]!
		me: User
    }

	type Mutation {
		addBook(
			title: String!
			author: String!
			published: Int!
			genres: [String!]!
		): Book!
		editAuthor(
			name: String!
			setBornTo: Int!
		): Author
		createUser(
			username: String!
			favoriteGenre: String!
		): User
		login(
			username: String!
			password: String!
		): Token
	}
`;

const resolvers = {
	Query: {
		bookCount: async () => Book.collection.countDocuments(),
		authorCount: async () => Author.collection.countDocuments(),
		allBooks: async (root, args) => {
			if (args.author && args.genre) {
				const author = await Author.findOne({ name: args.author });

				if (!author) {
					throw new GraphQLError('No author found', {
						extensions: {
							code: 'BAD_USER_INPUT',
							invalidArgs: args.author,
						},
					});
				}

				return Book.find({ author: author.id, genres: args.genre });
			}

			if (args.author) {
				const author = await Author.findOne({ name: args.author });

				if (!author) {
					throw new GraphQLError('No author found', {
						extensions: {
							code: 'BAD_USER_INPUT',
							invalidArgs: args.author,
						},
					});
				}

				return Book.find({ author: author.id }).populate('author', {
					name: 1,
					born: 1,
					id: 1,
				});
			}

			if (args.genre) {
				return Book.find({ genres: args.genre }).populate('author', {
					name: 1,
					born: 1,
					id: 1,
				});
			}

			return Book.find({}).populate('author', { name: 1, born: 1, id: 1 });
		},
		allAuthors: async () => {
			// const authorsInDB = await Author.find({});
			// const booksInDB = await Book.find({}).populate('author', {
			// 	name: 1,
			// 	born: 1,
			// 	id: 1,
			// });

			// console.log('authorsInDB', authorsInDB);
			// console.log('bookInDB', booksInDB);

			// const modifiedAuthors = authorsInDB.map((a) => {
			// 	const authorsBooks = booksInDB.filter((b) => b.author.name === a.name);

			// 	return { ...a, bookCount: authorsBooks.length };
			// });

			// console.log('modifiedAuthors', modifiedAuthors);

			// return modifiedAuthors;
			return Author.find({});
		},
		me: (root, args, context) => {
			return context.currentUser;
		},
	},
	Mutation: {
		addBook: async (root, args, { currentUser }) => {
			if (!currentUser) {
				throw new GraphQLError('not authenticated', {
					extensions: { code: 'BAD_USER_INPUT' },
				});
			}

			if (args.author.length < 4) {
				throw new GraphQLError('Author must at least 4 characters long', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.author,
					},
				});
			}

			if (args.title.length < 5) {
				throw new GraphQLError('Title must at least 5 characters long', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.title,
					},
				});
			}

			const authorInDB = await Author.findOne({ name: args.author });

			let authorId;

			if (!authorInDB) {
				const author = new Author({ name: args.author });
				const savedAuthor = await author.save();
				authorId = savedAuthor.id;
			}

			if (authorInDB) {
				authorId = authorInDB.id;
			}

			const book = new Book({ ...args, author: authorId });

			try {
				await book.save();
			} catch (error) {
				throw new GraphQLError('Saving book failed', {
					extensions: {
						code: 'BAD_USER_INPUT',
						error,
					},
				});
			}

			return Book.findOne({ title: args.title }).populate('author', {
				name: 1,
				born: 1,
				id: 1,
			});
		},
		editAuthor: async (root, args, { currentUser }) => {
			if (!currentUser) {
				throw new GraphQLError('not authenticated', {
					extensions: { code: 'BAD_USER_INPUT' },
				});
			}

			const author = await Author.findOne({ name: args.name });
			author.born = args.setBornTo;

			try {
				await author.save();
			} catch (error) {
				throw new GraphQLError('Saving bithyear failed', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.setBornTo,
						error,
					},
				});
			}

			return author;
		},
		createUser: async (root, args) => {
			const user = new User({
				username: args.username,
				favoriteGenre: args.favoriteGenre,
			});

			return user.save().catch((error) => {
				throw new GraphQLError('Creating the user failed', {
					extensions: {
						code: 'BAD_USER_INPUT',
						invalidArgs: args.username,
						error,
					},
				});
			});
		},
		login: async (root, args) => {
			const user = await User.findOne({ username: args.username });

			if (!user || args.password !== 'secret') {
				throw new GraphQLError('wrong credentials', {
					extensions: {
						code: 'BAD_USER_INPUT',
					},
				});
			}

			const userForToken = {
				username: user.username,
				id: user._id,
			};

			return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
		},
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

startStandaloneServer(server, {
	listen: { port: 4000 },
	context: async ({ req, res }) => {
		const auth = req ? req.headers.authorization : null;
		if (auth && auth.startsWith('Bearer ')) {
			const decodedToken = jwt.verify(
				auth.substring(7),
				process.env.JWT_SECRET
			);
			const currentUser = await User.findById(decodedToken.id);
			return { currentUser };
		}
	},
}).then(({ url }) => {
	console.log(`Server ready at ${url}`);
});
