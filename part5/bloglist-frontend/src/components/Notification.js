const Notification = ({ notification, notificationColor }) => {
	return (
		<h2
			style={{
				backgroundColor: `${notificationColor}`,
			}}
			className="notification"
		>
			{notification}
		</h2>
	);
};

export default Notification;
