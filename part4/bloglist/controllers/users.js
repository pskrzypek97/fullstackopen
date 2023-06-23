const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/user');

usersRouter.get('/', async (request, response) => {
	const users = await User.find({}).populate('blogs', {
		title: 1,
		url: 1,
		author: 1,
		likes: 1,
	});
	response.json(users);
});

usersRouter.post('/', async (request, response) => {
	const { username, password, name } = request.body;

	if (password.length < 3)
		response.status(400).json({ error: 'password too short' });

	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(password, saltRounds);

	const user = new User({ username, passwordHash, name });

	const savedUser = await user.save();

	response.status(200).json(savedUser);
});

module.exports = usersRouter;
