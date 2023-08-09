import { useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { removeNotification } from '../store/reducers/notificationReducer';

const Notification = () => {
	const notification = useSelector((state) => state.notification);
	const dispatch = useDispatch();

	useEffect(() => {
		setTimeout(() => dispatch(removeNotification()), 5000);
	}, [notification, dispatch]);

	const style = notification
		? {
				border: 'solid',
				padding: 10,
				borderWidth: 1,
		  }
		: { display: 'none' };

	return <div style={style}>{notification}</div>;
};

export default Notification;
