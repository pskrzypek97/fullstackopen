import { useState } from 'react';

const Button = ({ handleClick, feedback }) => {
	return <button onClick={handleClick}>{feedback}</button>;
};

const StatisticLine = ({ text, value }) => {
	return (
		<tr>
			<td>{text}</td>
			<td>{value}</td>
		</tr>
	);
};

const Statistics = ({ good, neutral, bad }) => {
	if (!good && !neutral && !bad) return <p>No feedback given</p>;

	const all = good + neutral + bad;

	const average = (good - bad) / all;

	const positive = `${(good / all) * 100}%`;

	return (
		<>
			<h1>statistics</h1>
			<table>
				<tbody>
					<StatisticLine text="good" value={good} />
					<StatisticLine text="neutral" value={neutral} />
					<StatisticLine text="bad" value={bad} />
					<StatisticLine text="all" value={all} />
					<StatisticLine text="average" value={average} />
					<StatisticLine text="positive" value={positive} />
				</tbody>
			</table>
		</>
	);
};

const App = () => {
	const [good, setGood] = useState(0);
	const [neutral, setNeutral] = useState(0);
	const [bad, setBad] = useState(0);

	const handleGood = () => setGood(good + 1);

	const handleNeutral = () => setNeutral(neutral + 1);

	const handleBad = () => setBad(bad + 1);

	return (
		<div>
			<h1>give feedback</h1>
			<Button handleClick={handleGood} feedback="good" />
			<Button handleClick={handleNeutral} feedback="neutral" />
			<Button handleClick={handleBad} feedback="bad" />
			<Statistics good={good} neutral={neutral} bad={bad} />
		</div>
	);
};

export default App;
