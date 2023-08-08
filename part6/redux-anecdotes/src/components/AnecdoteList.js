import { useSelector, useDispatch } from 'react-redux';

import { voteAnecdote } from '../reducers/anecdoteReducer';

const Anecdote = ({ anecdote, handleVote }) => {
	return (
		<div>
			<div>{anecdote.content}</div>
			<div>
				has {anecdote.votes}
				<button onClick={() => handleVote(anecdote.id)}>vote</button>
			</div>
		</div>
	);
};

const AnecdoteList = () => {
	const anecdotes = useSelector((state) => state);
	const dispatch = useDispatch();

	const vote = (id) => {
		dispatch(voteAnecdote(id));
	};

	return (
		<>
			{anecdotes
				.sort((a, b) => b.votes - a.votes)
				.map((anecdote) => (
					<Anecdote key={anecdote.id} anecdote={anecdote} handleVote={vote} />
				))}
		</>
	);
};

export default AnecdoteList;
