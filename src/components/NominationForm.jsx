import {useState} from 'react';
import {Form, Button, Row, Col} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import axios from '../services/axios';
import {toast} from 'react-toastify';

export default function NominationForm({isEdit = false, initialValues = {}}) {
    const [formData, setFormData] = useState({
        contract_name: initialValues.contract_name || '',
        buyer: initialValues.buyer || '',
        seller: initialValues.seller || '',
        arrival_period: initialValues.arrival_period?.slice(0, 10) || '',
        nomination_date: initialValues.nomination_date?.slice(0, 10) || '',
        nomination_type: initialValues.nomination_type || '',
        nomination_keyword: initialValues.nomination_keyword || '',
        for_seller_or_buyer: initialValues.for_seller_or_buyer || 'seller',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isEdit) {
                await axios.put(`/nominations/${initialValues._id}`, formData);
                toast.success('Nomination updated');
            } else {
                await axios.post('/nominations', formData);
                toast.success('Nomination created');
            }

            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || 'Error saving nomination');
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Row>
                <Col md={6}>
                    <Form.Group controlId="contract_name" className="mb-3">
                        <Form.Label column="">Contract Name</Form.Label>
                        <Form.Control name="contract_name" value={formData.contract_name} onChange={handleChange}
                                      required/>
                    </Form.Group>
                    <Form.Group controlId="buyer" className="mb-3">
                        <Form.Label column="">Buyer</Form.Label>
                        <Form.Control name="buyer" value={formData.buyer} onChange={handleChange} required/>
                    </Form.Group>
                    <Form.Group controlId="seller" className="mb-3">
                        <Form.Label column="">Seller</Form.Label>
                        <Form.Control name="seller" value={formData.seller} onChange={handleChange} required/>
                    </Form.Group>
                    <Form.Group controlId="arrival_period" className="mb-3">
                        <Form.Label column="">Arrival Period</Form.Label>
                        <Form.Control type="date" name="arrival_period" value={formData.arrival_period}
                                      onChange={handleChange} required/>
                    </Form.Group>
                    <Form.Group controlId="nomination_date" className="mb-3">
                        <Form.Label column="">Nomination Date</Form.Label>
                        <Form.Control type="date" name="nomination_date" value={formData.nomination_date}
                                      onChange={handleChange} required/>
                    </Form.Group>
                    <Form.Group controlId="nomination_type" className="mb-3">
                        <Form.Label column="">Nomination Type</Form.Label>
                        <Form.Control name="nomination_type" value={formData.nomination_type} onChange={handleChange}
                                      required/>
                    </Form.Group>
                    <Form.Group controlId="nomination_keyword" className="mb-3">
                        <Form.Label column="">Nomination Keyword</Form.Label>
                        <Form.Control name="nomination_keyword" value={formData.nomination_keyword}
                                      onChange={handleChange} required/>
                    </Form.Group>
                    <Form.Group controlId="for_seller_or_buyer" className="mb-3">
                        <Form.Label column="">For</Form.Label>
                        <Form.Select name="for_seller_or_buyer" value={formData.for_seller_or_buyer}
                                     onChange={handleChange}>
                            <option value="seller">Seller</option>
                            <option value="buyer">Buyer</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            <Button type="submit" variant="primary" className="me-3">
                {isEdit ? 'Update' : 'Create'}
            </Button>

            <Button type="button" variant="outline-dark" onClick={() => navigate('/')}>
                Cancel
            </Button>
        </Form>
    );
}
