import { Link } from 'react-router-dom';

const UserPage = ({ userObject }) => {
    if (!userObject) return null;

    return (
        <>
            <h3>{userObject.name}</h3>
            <b>added blogs</b>
            <br></br>
            {!userObject.blogs.length && <b>no blogs</b>}
            <ul>
                {userObject.blogs.map((b) => (
                    <li key={b.id}>
                        <Link to={`/blogs/${b.id}`}>{b.title}</Link>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default UserPage;
