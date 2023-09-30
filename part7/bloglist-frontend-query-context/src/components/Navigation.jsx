import { Link } from 'react-router-dom';

import { useUserValue } from '../store/UserContext';

const Navigation = () => {
	const user = useUserValue();

	const handleLogout = () => {
		window.localStorage.clear();
		window.location.reload();
	};

	const padding = { padding: '5px' };

	const navStyle = { backgroundColor: 'grey' };

	const spanStyle = { color: 'white', padding: 5 };

	return (
		<nav style={navStyle}>
			<Link to={'/'} style={padding}>
				blogs
			</Link>

			<Link to={'/users'} style={padding}>
				users
			</Link>

			<div>
				<span style={spanStyle}>{user.name} logged in </span>
				<button onClick={handleLogout}>logout</button>
			</div>
		</nav>
	);
};

export default Navigation;
