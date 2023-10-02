import { Alert } from '@mui/material';

import { useNotificationValue } from '../store/NotificationContext';

const Notification = () => {
	const { value, severity } = useNotificationValue();

	return (
		<Alert className="notification" severity={severity}>
			{value}
		</Alert>
	);
};

export default Notification;
