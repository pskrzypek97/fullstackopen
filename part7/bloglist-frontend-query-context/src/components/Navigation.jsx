import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button } from '@mui/material';

import { useUserValue } from '../store/UserContext';

const Navigation = () => {
	const user = useUserValue();

	const handleLogout = () => {
		window.localStorage.clear();
		window.location.reload();
	};

	const spanStyle = { color: 'white', padding: 5 };

	return (
		<AppBar position="static">
			<Toolbar>
				<Button color="inherit" component={Link} to="/">
					home
				</Button>

				<Button color="inherit" component={Link} to="/users">
					users
				</Button>

				{user && (
					<>
						<Button color="inherit" onClick={handleLogout}>
							logout
						</Button>
						<span style={spanStyle}>{user.name} logged in </span>
					</>
				)}
			</Toolbar>
		</AppBar>
	);
};

export default Navigation;
