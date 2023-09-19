import { useState } from 'react';

import { useDispatch } from 'react-redux';

import { setNotification } from '../store/reducers/notificationReducer';
import { loginUser } from '../store/reducers/userReducers';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();

    const handleLogin = (e) => {
        e.preventDefault();

        try {
            dispatch(loginUser({ username, password }));
        } catch (exception) {
            dispatch(
                setNotification(
                    { message: 'wrong username or password', color: 'red' },
                    5
                )
            );
        }
        setUsername('');
        setPassword('');
    };

    return (
        <div>
            <h2>log in to application</h2>

            <form onSubmit={handleLogin} className="loginForm">
                <div>
                    username{' '}
                    <input
                        type="text"
                        value={username}
                        name="Username"
                        id="username"
                        onChange={({ target }) => setUsername(target.value)}
                    />
                </div>
                <div>
                    password{' '}
                    <input
                        type="text"
                        value={password}
                        name="Password"
                        id="password"
                        onChange={({ target }) => setPassword(target.value)}
                    />
                </div>
                <button type="submit" className="login-button">
                    login
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
