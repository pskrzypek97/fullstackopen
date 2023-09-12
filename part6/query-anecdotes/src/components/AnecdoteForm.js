import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useNotificationDispatch } from '../NotificationContext';

import { createAnecdote } from '../requests';

const AnecdoteForm = () => {
	const dispatch = useNotificationDispatch();

	const queryClient = useQueryClient();

	const newAnecdoteMutation = useMutation({
		mutationFn: createAnecdote,
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ['anecdotes'] }),
	});

	const onCreate = (event) => {
		event.preventDefault();
		const content = event.target.anecdote.value;
		event.target.anecdote.value = '';
		if (content.length < 5) {
			dispatch({
				type: 'NEW_NOTIFICATION',
				payload: 'too short anecdote, must have length 5 or more',
			});
			setTimeout(() => dispatch({ type: 'NO_NOTIFICATION' }), 5000);
		}
		newAnecdoteMutation.mutate({ content, votes: 0 });
		if (content.length >= 5) {
			dispatch({
				type: 'NEW_NOTIFICATION',
				payload: `created new anecdote "${content}"`,
			});
			setTimeout(() => dispatch({ type: 'NO_NOTIFICATION' }), 5000);
		}
	};

	return (
		<div>
			<h3>create new</h3>
			<form onSubmit={onCreate}>
				<input name="anecdote" />
				<button type="submit">create</button>
			</form>
		</div>
	);
};

export default AnecdoteForm;
