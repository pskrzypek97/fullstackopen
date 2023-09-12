import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import AnecdoteForm from './components/AnecdoteForm';
import Notification from './components/Notification';

import { getAnecdotes, updateAnecdote } from './requests';

const App = () => {
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
	};

	if (result.isLoading) return <div>loading data...</div>;
	if (result.isError)
		return <div>anecdote service not availabe due to problems in server</div>;

	return (
		<div>
			<h3>Anecdote app</h3>

			<Notification />
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
