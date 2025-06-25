import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Container, Form, Button, Alert, Row, Col} from 'react-bootstrap';
import {toast} from 'react-toastify';
import {useAuth} from "../services/utils.js";


export default function Login() {
    const {login} = useAuth()
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(name, password);
            toast.success('Login successful');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Login failed');
        }
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={4}>
                    <h3 className="mb-3">Login</h3>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button type="submit" variant="primary" className="w-100">
                            Login
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}
