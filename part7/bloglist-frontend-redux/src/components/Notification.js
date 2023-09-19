import { useSelector } from 'react-redux';

const Notification = () => {
    const notification = useSelector((state) => state.notification);

    const style = notification
        ? { backgroundColor: notification?.color }
        : { display: 'none' };

    return (
        <h2 style={style} className="notification">
            {notification?.message}
        </h2>
    );
};

export default Notification;
