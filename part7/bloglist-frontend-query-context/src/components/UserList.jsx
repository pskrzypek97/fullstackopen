import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
	Table,
	TableContainer,
	TableBody,
	TableCell,
	TableRow,
	Paper,
} from '@mui/material';

const UserList = ({ users }) => {
	return (
		<>
			<h2>Users</h2>

			<TableContainer component={Paper}>
				<Table>
					<TableBody>
						<TableRow>
							<TableCell></TableCell>
							<TableCell>
								<b>blogs created</b>
							</TableCell>
						</TableRow>
						{users.map((u) => (
							<TableRow key={u.id}>
								<TableCell>
									<Link to={`/users/${u.id}`}>{u.name}</Link>
								</TableCell>
								<TableCell>{u.blogs.length}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</>
	);
};

UserList.propTypes = {
	users: PropTypes.array,
};

export default UserList;
