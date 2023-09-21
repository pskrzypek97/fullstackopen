import { useSelector } from 'react-redux/es/hooks/useSelector';

import { Link } from 'react-router-dom';

import { Navbar, Nav, Button } from 'react-bootstrap';

const Navigation = () => {
    const user = useSelector((state) => state.user);

    const handleLogout = () => {
        window.localStorage.clear();
        window.location.reload();
    };

    const padding = { padding: '5px' };

    const spanStyle = { color: 'white', padding: 5 };

    return (
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="#" as="span">
                        <Link to={'/'} style={padding}>
                            blogs
                        </Link>
                    </Nav.Link>
                    <Nav.Link href="#" as="span">
                        <Link to={'/users'} style={padding}>
                            users
                        </Link>
                    </Nav.Link>
                    <div>
                        <span style={spanStyle}>{user.name} logged in </span>
                        <Button onClick={handleLogout}>logout</Button>
                    </div>
                </Nav>{' '}
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Navigation;
