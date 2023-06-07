const Total = ({ parts }) => {
	const total = parts.reduce((acc, curPart) => acc + curPart.exercises, 0);

	return <b>Number of exercises {total}</b>;
};

export default Total;
