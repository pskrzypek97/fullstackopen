import { useSelector, useDispatch } from 'react-redux';

import { voteAnecdote } from '../store/reducers/anecdoteReducer';
import { setNotification } from '../store/reducers/notificationReducer';

const Anecdote = ({ anecdote, handleVote }) => {
	return (
		<div>
			<div>{anecdote.content}</div>
			<div>
				has {anecdote.votes}
				<button onClick={() => handleVote(anecdote.id, anecdote.content)}>
					vote
				</button>
			</div>
		</div>
	);
};

const AnecdoteList = () => {
	const anecdotes = useSelector(({ anecdotes, filter }) => {
		return filter
			? anecdotes.filter((a) => a.content.includes(filter))
			: anecdotes;
	});

	const dispatch = useDispatch();

	const vote = (id, content) => {
		dispatch(voteAnecdote(id));
		dispatch(setNotification(`you voted "${content}"`));
	};

	return (
		<>
			{anecdotes
				.toSorted((a, b) => b.votes - a.votes)
				.map((anecdote) => (
					<Anecdote key={anecdote.id} anecdote={anecdote} handleVote={vote} />
				))}
		</>
	);
};

export default AnecdoteList;
