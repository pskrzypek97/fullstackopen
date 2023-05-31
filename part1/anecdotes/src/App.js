import { useState } from 'react';

const App = () => {
	const anecdotes = [
		'If it hurts, do it more often.',
		'Adding manpower to a late software project makes it later!',
		'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
		'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
		'Premature optimization is the root of all evil.',
		'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
		'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
		'The only way to go fast, is to go well.',
	];

	const [selected, setSelected] = useState(0);
	const [voteArray, setVoteArray] = useState(new Uint8Array(anecdotes.length));
	const [mostVotesIndex, setMostVotesIndex] = useState(0);

	const handleSelected = () => {
		const randomIndex = Math.floor(Math.random() * anecdotes.length);
		setSelected(randomIndex);
	};

	const handleVoting = () => {
		const copy = [...voteArray];
		copy[selected] += 1;
		setVoteArray(copy);
		setMostVotesIndex(copy.indexOf(Math.max(...copy)));
	};

	return (
		<div>
			<h1>Anecdote of the day</h1>
			{anecdotes[selected]}
			<p>has {voteArray[selected]} votes</p>
			<br />
			<button onClick={handleVoting}>vote</button>
			<button onClick={handleSelected}>next anecdote</button>
			<h1>Anecdote with most votes</h1>
			{anecdotes[mostVotesIndex]}
			<p>has {voteArray[mostVotesIndex]} votes</p>
		</div>
	);
};

export default App;
