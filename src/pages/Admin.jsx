import {useEffect, useState} from 'react';
import {Button, Form, Modal, Table} from 'react-bootstrap';
import axios from '../services/axios';
import Swal from 'sweetalert2';
import {toast} from 'react-toastify';


export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({name: '', password: ''});

    const fetchUsers = async () => {
        const res = await axios.get('/users');
        setUsers(res.data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleShow = (user = null) => {
        setEditingUser(user);
        setFormData({
            name: user?.name || '',
            password: '',
        });
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setFormData({name: '', password: ''});
        setEditingUser(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingUser) {
                await axios.put(`/users/${editingUser._id}`, {
                    name: formData.name,
                    password: formData.password,
                    is_admin: false,
                });
                toast.success('User updated');
            } else {
                await axios.post('/users', {
                    name: formData.name,
                    password: formData.password,
                    is_admin: false,
                });
                toast.success('User created');
            }
            handleClose();
            await fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Error saving user');
        }
    };

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: 'Delete User?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete',
        });

        if (!confirm.isConfirmed) return;

        try {
            await axios.delete(`/users/${id}`);
            toast.success('User deleted');
            await fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Delete failed');
        }
    };


    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Users</h2>
                <Button onClick={() => handleShow()}>Create User</Button>
            </div>

            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Is Admin</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {users.map((u) => (
                    <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.is_admin ? 'Yes' : 'No'}</td>
                        <td>
                            <Button
                                variant="primary"
                                size="sm"
                                className="me-2"
                                onClick={() => handleShow(u)}
                            >
                                Edit
                            </Button>
                            {u.name !== 'admin' && (
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(u._id)}
                                >
                                    Delete
                                </Button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingUser ? 'Edit User' : 'Create User'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="name" className="mb-3">
                            <Form.Label column="">Username</Form.Label>
                            <Form.Control
                                required
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({...formData, name: e.target.value})
                                }
                            />
                        </Form.Group>

                        <Form.Group controlId="password" className="mb-3">
                            <Form.Label column="">Password {editingUser ? '(leave blank to keep current)' : ''}</Form.Label>
                            <Form.Control
                                type="password"
                                value={formData.password}
                                onChange={(e) =>
                                    setFormData({...formData, password: e.target.value})
                                }
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            {editingUser ? 'Update' : 'Create'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
}
