import { Link } from 'react-router-dom';

import { Table } from 'react-bootstrap';

const UserList = ({ users }) => {
    return (
        <>
            <h2>Users</h2>
            <Table striped>
                <tbody>
                    <tr>
                        <td></td>
                        <td>
                            <b>blogs created</b>
                        </td>
                    </tr>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>
                                <Link to={`/users/${u.id}`}>{u.name}</Link>
                            </td>
                            <td>{u.blogs.length}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
};

export default UserList;
