import { useDispatch } from 'react-redux';

import { createAnecdote } from '../store/reducers/anecdoteReducer';
import { setNotification } from '../store/reducers/notificationReducer';

const AnecdoteForm = () => {
	const dispatch = useDispatch();

	const addAnecdote = (e) => {
		e.preventDefault();

		const content = e.target.anecdote.value;
		e.target.anecdote.value = '';
		dispatch(createAnecdote(content));
		dispatch(setNotification(`you created "${content}"`));
	};

	return (
		<>
			<h2>create new</h2>
			<form onSubmit={addAnecdote}>
				<div>
					<input name="anecdote" />
				</div>
				<button type="submit">create</button>
			</form>
		</>
	);
};

export default AnecdoteForm;