const Notification = ({ message, error }) => {
	if (!message) return null;

	const notificationStyle = {
		color: error ? 'red' : 'green',
		background: 'lightgray',
		fontSize: 20,
		borderStyle: 'solid',
		borderRadius: 5,
		padding: 10,
		marginBottom: 10,
	};

	return <div style={notificationStyle}>{message}</div>;
};

export default Notification;
