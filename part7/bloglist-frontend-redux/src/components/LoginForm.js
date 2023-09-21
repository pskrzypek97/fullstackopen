import { useState } from 'react';

import { useDispatch } from 'react-redux';

import { setNotification } from '../store/reducers/notificationReducer';
import { loginUser } from '../store/reducers/userReducers';

import { Form, Button } from 'react-bootstrap';

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
                    {
                        message: 'wrong username or password',
                        variant: 'danger',
                    },
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

            <Form onSubmit={handleLogin} className="loginForm">
                <Form.Group>
                    <div>
                        <Form.Label>username </Form.Label>
                        <Form.Control
                            type="text"
                            value={username}
                            name="Username"
                            id="username"
                            onChange={({ target }) => setUsername(target.value)}
                        />
                    </div>
                    <div>
                        <Form.Label>password </Form.Label>
                        <Form.Control
                            type="text"
                            value={password}
                            name="Password"
                            id="password"
                            onChange={({ target }) => setPassword(target.value)}
                        />
                    </div>
                    <Button type="submit" className="login-button">
                        login
                    </Button>
                </Form.Group>
            </Form>
        </div>
    );
};

export default LoginForm;
