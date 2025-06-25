import {useCallback, useEffect, useState} from 'react';
import axios from '../services/axios';
import {
    Button, Modal, Card, Col, Container, Dropdown, Form, Row, Spinner, Table, Pagination
} from 'react-bootstrap';
import dayjs from 'dayjs';
import {toast} from 'react-toastify';
import Swal from 'sweetalert2';
import {useNavigate} from 'react-router-dom';
import copy from 'copy-to-clipboard';
import {nominationStatsConfig} from "../services/utils.js";

const getRowClass = (nom) => {
    const nominationDate = dayjs(nom.nomination_date);
    const now = dayjs();

    if ((nom.sent || nom.received)) return 'text-success';

    if (nominationDate.isSame(now, 'day')) return 'text-danger';

    if (nominationDate.isSame(now, 'week')) return 'text-warning';

    if (nominationDate.isSame(now, 'month')) return 'text-warning-emphasis';

    if (nominationDate.isAfter(now)) return 'text-danger-emphasis';

    return 'text-secondary-emphasis';
};

export default function Dashboard() {
    const [nominations, setNominations] = useState([]);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({});
    const [filterUser, setFilterUser] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedNom, setSelectedNom] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState('');

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [total, setTotal] = useState(0);

    const fetchNominations = useCallback(async () => {
        setLoading(true);
        try {
            const res = await axios.get('/nominations', {
                params: {
                    user_id: filterUser,
                    status: filterStatus,
                    page: currentPage,
                    limit: limit
                }
            });
            setNominations(res.data.nominations);
            setTotal(res.data.total);

            const res1 = await axios.get('/nominations/stats/summary');
            setStats(res1.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [filterUser, filterStatus, currentPage, limit]);

    const fetchUsers = async () => {
        const res = await axios.get('/users');
        setUsers(res.data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        fetchNominations();
    }, [fetchNominations]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filterUser, filterStatus]);

    const handleCardClick = (statusKey) => {
        setFilterStatus(statusKey);
    };

    const handleAssignUser = (nomination) => {
        setSelectedNom(nomination);
        setSelectedUserId(nomination.user_id?._id || '');
        setShowAssignModal(true);
    };

    const submitAssignUser = async () => {
        try {
            await axios.put(`/nominations/${selectedNom._id}/assign`, {
                user_id: selectedUserId,
            });
            toast.success('User assigned');
            setShowAssignModal(false);
            await fetchNominations();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to assign user');
        }
    };

    const navigate = useNavigate();

    const handleEditNom = (nom) => {
        navigate(`/nominations/edit/${nom._id}`);
    };

    const handleDeleteNom = async (id) => {
        const confirm = await Swal.fire({
            title: 'Are you sure?',
            text: 'This nomination will be deleted',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        });

        if (confirm.isConfirmed) {
            try {
                await axios.delete(`/nominations/${id}`);
                toast.success('Deleted successfully');
                await fetchNominations();
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to delete');
            }
        }
    };

    const handleSendNom = async (id) => {
        try {
            const res = await axios.get(`/nominations/${id}/send-content`);
            copy(res.data.content);
            toast.success('Content copied to clipboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to generate message');
        }
    };

    const handleSendAllNom = async (id) => {
        try {
            const res = await axios.get(`/nominations/${id}/send-all-content`);
            copy(res.data.content);
            toast.success('Bulk content copied');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to generate bulk message');
        }
    };

    const [selectedIds, setSelectedIds] = useState([]);

    // Calculate pagination values
    const totalPages = Math.ceil(total / limit);
    const startItem = (currentPage - 1) * limit + 1;
    const endItem = Math.min(currentPage * limit, total);

    // Generate pagination items
    const renderPaginationItems = () => {
        const items = [];

        // First page
        if (currentPage > 3) {
            items.push(
                <Pagination.Item key={1} onClick={() => setCurrentPage(1)}>
                    1
                </Pagination.Item>
            );
            if (currentPage > 4) {
                items.push(<Pagination.Ellipsis key="start-ellipsis" />);
            }
        }

        // Pages around current page
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);

        for (let page = startPage; page <= endPage; page++) {
            items.push(
                <Pagination.Item
                    key={page}
                    active={page === currentPage}
                    onClick={() => setCurrentPage(page)}
                >
                    {page}
                </Pagination.Item>
            );
        }

        // Last page
        if (currentPage < totalPages - 2) {
            if (currentPage < totalPages - 3) {
                items.push(<Pagination.Ellipsis key="end-ellipsis" />);
            }
            items.push(
                <Pagination.Item key={totalPages} onClick={() => setCurrentPage(totalPages)}>
                    {totalPages}
                </Pagination.Item>
            );
        }

        return items;
    };

    return (
        <Container fluid>
            <h4 className="mt-3 mb-4 text-center">Nominations</h4>

            <Row className="mb-3">
                {nominationStatsConfig.map(({key, label, class_name}) => (
                    <Col key={key}>
                        <Card
                            bg="light"
                            className="cursor-pointer"
                            onClick={() => handleCardClick(key)}
                            style={{border: filterStatus === key ? '2px solid #007bff' : ''}}
                        >
                            <Card.Body className={`text-center ${class_name}`}>
                                <strong>{label}</strong><br/>
                                {stats[key] || 0}
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row className="mb-3">
                <Col md={4}>
                    <Form.Select
                        className="mb-3"
                        value={filterUser}
                        onChange={(e) => setFilterUser(e.target.value)}
                    >
                        <option value="">All Users</option>
                        {users.map((u) => (
                            <option key={u._id} value={u._id}>{u.name}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col md={4}>
                    <Form.Select
                        onChange={async (e) => {
                            const action = e.target.value;
                            if (!action || selectedIds.length === 0) {
                                toast.error('Select nominations');
                                return;
                            }

                            const confirm = await Swal.fire({
                                title: 'Are you sure?',
                                text: `Mark ${selectedIds.length} nomination(s) as ${action}?`,
                                icon: 'warning',
                                showCancelButton: true,
                                confirmButtonText: 'Yes, update it!',
                            });

                            if (confirm.isConfirmed) {
                                try {
                                    await axios.put('/nominations/bulk-update-status', {
                                        ids: selectedIds,
                                        action: action,
                                    });
                                    toast.success('Bulk update done');
                                    setSelectedIds([]);
                                    await fetchNominations();
                                } catch (err) {
                                    toast.error(err.response?.data?.message || 'Failed to update');
                                }
                            }

                            e.target.value = '';
                        }}
                    >
                        <option value="">Bulk Action</option>
                        <option value="sent">Mark as Sent</option>
                        <option value="received">Mark as Received</option>
                    </Form.Select>
                </Col>
                <Col md={4}>
                    <Form.Select
                        value={limit}
                        onChange={(e) => {
                            setLimit(Number(e.target.value));
                            setCurrentPage(1);
                        }}
                    >
                        <option value={10}>10 per page</option>
                        <option value={25}>25 per page</option>
                        <option value={50}>50 per page</option>
                        <option value={100}>100 per page</option>
                    </Form.Select>
                </Col>
            </Row>

            {/* Pagination Info */}
            <Row className="mb-3">
                <Col>
                    <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted">
                            Showing {total > 0 ? startItem : 0} to {endItem} of {total} entries
                        </span>
                    </div>
                </Col>
            </Row>

            {loading ? (
                <div className="text-center">
                    <Spinner animation="border"/>
                </div>
            ) : (
                <>
                    <Table bordered hover responsive>
                        <thead>
                        <tr>
                            <th>
                                <Form.Check
                                    type="checkbox"
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            const allIds = nominations.map((n) => n._id);
                                            setSelectedIds(allIds);
                                        } else {
                                            setSelectedIds([]);
                                        }
                                    }}
                                    checked={nominations.length > 0 && selectedIds.length === nominations.length}
                                />
                            </th>
                            <th>Contract</th>
                            <th>Arrival / Nomination Date</th>
                            <th>Type / Buyer & Seller</th>
                            <th>Assigned User</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {nominations.map(nom => (
                            <tr key={nom._id}>
                                <td>
                                    <Form.Check
                                        type="checkbox"
                                        checked={selectedIds.includes(nom._id)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedIds((prev) => [...prev, nom._id]);
                                            } else {
                                                setSelectedIds((prev) => prev.filter((id) => id !== nom._id));
                                            }
                                        }}
                                    />
                                </td>
                                <td className={getRowClass(nom)}>{nom.contract_name}</td>
                                <td className={getRowClass(nom)}>
                                    {dayjs(nom.arrival_period).format('YYYY-MM-DD')}<br/>
                                    {dayjs(nom.nomination_date).format('YYYY-MM-DD')}
                                </td>
                                <td>
                                    {nom.nomination_type}<br/>
                                    Seller: {nom.seller} | Buyer: {nom.buyer}
                                </td>
                                <td className={getRowClass(nom)}>{nom.user_id?.name || ''}</td>
                                <td className="text-primary">
                                    {nom.sent ? 'Sent' : nom.received ? 'Received' : ''}
                                </td>
                                <td>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="primary" size="sm">
                                            Option
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => handleAssignUser(nom)}>Assign User</Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleEditNom(nom)}>Edit Nom</Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleDeleteNom(nom._id)}>Delete
                                                Nom</Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleSendNom(nom._id)}>Send
                                                Nom</Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleSendAllNom(nom._id)}>Send All
                                                Nom</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Row className="mt-4">
                            <Col className="d-flex justify-content-center">
                                <Pagination>
                                    <Pagination.Prev
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(currentPage - 1)}
                                    />
                                    {renderPaginationItems()}
                                    <Pagination.Next
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(currentPage + 1)}
                                    />
                                </Pagination>
                            </Col>
                        </Row>
                    )}
                </>
            )}

            <Modal show={showAssignModal} onHide={() => setShowAssignModal(false)}>
                <Modal.Header closeButton><Modal.Title>Assign User</Modal.Title></Modal.Header>
                <Modal.Body>
                    <Form.Select
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                    >
                        <option value="">Select User</option>
                        {users.map((u) => (
                            <option key={u._id} value={u._id}>{u.name}</option>
                        ))}
                    </Form.Select>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAssignModal(false)}>Cancel</Button>
                    <Button onClick={submitAssignUser}>Assign</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}