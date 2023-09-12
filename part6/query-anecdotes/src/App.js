import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
	useNotificationDispatch,
	useNotificationValue,
} from './NotificationContext';

import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';

import { getAnecdotes, updateAnecdote } from './requests';

const App = () => {
	const dispatch = useNotificationDispatch();
	const notification = useNotificationValue();

	const result = useQuery({
		queryKey: ['anecdotes'],
		queryFn: getAnecdotes,
		refetchOnWindowFocus: false,
	});

	const anecdotes = result.data;

	const queryClient = useQueryClient();

	const updateAnecdoteMutation = useMutation({
		mutationFn: updateAnecdote,
		onSuccess: () => queryClient.invalidateQueries('anecdotes'),
	});

	const handleVote = (anecdote) => {
		updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 });
		dispatch({
			type: 'NEW_NOTIFICATION',
			payload: `anecdote "${anecdote.content}" voted`,
		});
		setTimeout(() => dispatch({ type: 'NO_NOTIFICATION' }), 5000);
	};

	if (result.isLoading) return <div>loading data...</div>;
	if (result.isError)
		return <div>anecdote service not availabe due to problems in server</div>;

	return (
		<div>
			<h3>Anecdote app</h3>

			{notification && <Notification />}
			<AnecdoteForm />

			{anecdotes.map((anecdote) => (
				<div key={anecdote.id}>
					<div>{anecdote.content}</div>
					<div>
						has {anecdote.votes}
						<button onClick={() => handleVote(anecdote)}>vote</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default App;
