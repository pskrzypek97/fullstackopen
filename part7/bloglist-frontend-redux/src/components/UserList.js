import { Link } from 'react-router-dom';

const UserList = ({ users }) => {
    return (
        <>
            <h2>Users</h2>
            <table>
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
            </table>
        </>
    );
};

export default UserList;
