import { createSlice } from '@reduxjs/toolkit';

import anecdotesService from '../../services/anecdotes';

const anecdotesSlice = createSlice({
	name: 'anecdotes',
	initialState: [],
	reducers: {
		updateVote(state, action) {
			const id = action.payload;
			const anecdoteToVote = state.find((a) => a.id === id);
			const upvotedAnecdote = {
				...anecdoteToVote,
				votes: anecdoteToVote.votes + 1,
			};
			return state.map((a) => (a.id !== id ? a : upvotedAnecdote));
		},
		appendAnecdote(state, action) {
			state.push(action.payload);
		},
		setAnecdotes(state, action) {
			return action.payload;
		},
	},
});

export const { updateVote, setAnecdotes, appendAnecdote } =
	anecdotesSlice.actions;

export const initializeAnecdotes = () => {
	return async (dispatch) => {
		const anecdotes = await anecdotesService.getAll();
		dispatch(setAnecdotes(anecdotes));
	};
};

export const createAnecdote = (content) => {
	return async (dispatch) => {
		const newAnecdote = await anecdotesService.createAnecdote(content);
		dispatch(appendAnecdote(newAnecdote));
	};
};

export const voteAnecdote = (id, anecdotes) => {
	return async (dispatch) => {
		dispatch(updateVote(id));

		const anecdoteToVote = anecdotes.find((a) => a.id === id);

		await anecdotesService.voteAnecdote(id, {
			...anecdoteToVote,
			votes: anecdoteToVote.votes + 1,
		});
	};
};

export default anecdotesSlice.reducer;
