import { useSelector } from 'react-redux';

import { Alert } from 'react-bootstrap';

const Notification = () => {
    const notification = useSelector((state) => state.notification);

    const style = notification ? { display: 'block' } : { display: 'none' };

    return (
        <Alert variant={notification?.variant} style={style}>
            {notification?.message}
        </Alert>
    );
};

export default Notification;
