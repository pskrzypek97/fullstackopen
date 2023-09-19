import { useSelector } from 'react-redux/es/hooks/useSelector';

import { Link } from 'react-router-dom';

const Navigation = () => {
    const user = useSelector((state) => state.user);

    const handleLogout = () => {
        window.localStorage.clear();
        window.location.reload();
    };

    const bStyle = { marginRight: '5px' };

    return (
        <div style={{ backgroundColor: 'grey', padding: '5px' }}>
            <b style={bStyle}>
                <Link to={'/'}>blogs</Link>
            </b>
            <b style={bStyle}>
                <Link to={'/users'}>users</Link>
            </b>
            <span>
                {user.name} logged in{' '}
                <button onClick={handleLogout}>logout</button>
            </span>
        </div>
    );
};

export default Navigation;
