import { useNotificationValue } from '../store/NotificationContext';

const Notification = () => {
	const { value, color } = useNotificationValue();

	return (
		<h2
			style={{
				backgroundColor: `${color}`,
			}}
			className="notification"
		>
			{value}
		</h2>
	);
};

export default Notification;
