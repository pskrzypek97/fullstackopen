import axios from 'axios';

const baseUrl = 'http://localhost:3001/anecdotes';

const getAll = async () => {
	const res = await axios.get(baseUrl);
	return res.data;
};

const createAnecdote = async (content) => {
	const res = await axios.post(baseUrl, { content, votes: 0 });
	return res.data;
};

const voteAnecdote = async (id, newObject) => {
	const res = await axios.put(`${baseUrl}/${id}`, newObject);
	return res.data;
};

const anecdotesService = { getAll, createAnecdote, voteAnecdote };

export default anecdotesService;
