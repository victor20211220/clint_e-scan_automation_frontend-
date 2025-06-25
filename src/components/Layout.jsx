import {Container, Row, Col, Nav} from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';
import {useAuth} from "../services/utils.js";

export default function Layout({children}) {
    const {user, logout} = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Container fluid>
            <Row>
                <Col md={2} className="bg-primary min-vh-100 d-flex flex-column p-3">
                    <div className="mb-4">
                        <Nav.Link as={Link} to="/" className="text-white text-decoration-none mb-3">
                            <h3>Nomination Tracker</h3>
                        </Nav.Link>
                    </div>
                    <Nav className="flex-column mb-auto">
                        <Nav.Link as={Link} to="/" className="text-white text-decoration-none mb-3">Nominations</Nav.Link>
                        <Nav.Link as={Link} to="/new-nomination" className="text-white text-decoration-none mb-3">New Nomination</Nav.Link>
                        {user?.is_admin && (
                            <Nav.Link as={Link} to="/admin" className="text-white text-decoration-none mb-3">Admin</Nav.Link>
                        )}
                        <Nav.Link onClick={handleLogout} className="text-white text-decoration-none mb-3">
                            Logout
                        </Nav.Link>
                    </Nav>
                </Col>
                <Col md={10} className="p-4">
                    {children}
                </Col>
            </Row>
        </Container>
    );
}
