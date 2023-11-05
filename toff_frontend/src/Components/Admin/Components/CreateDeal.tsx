import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { InputGroup } from 'react-bootstrap';
import { useAuth } from '../../../Utils/AuthProvider';
import { API_BASE_URL } from '../../../config';

// @ts-ignore
function CreateDeal({ show, onHide }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        link: '',
    });
    const {token} = useAuth();

    // @ts-ignore
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleAddStats = () => {
        const formDataJSON = JSON.stringify({ deal: formData });

        fetch(`${API_BASE_URL}/api/deals/create`, {
            method: 'POST',
            // @ts-ignore
            headers: {
                'Content-Type': 'application/json',
                'authorization': token,
            },
            body: formDataJSON,
        })
            .then((response) => {
                if (response.ok) {
                    onHide();
                } else {
                    // Handle errors
                }
            })
            .catch((error) => {
                console.error('Error sending data to the backend:', error);
            });
    };


    return (
        <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Neuen Deal hinzufügen</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="createStatsForm.Title">
                        <Form.Label>Titel</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Gold-Deal"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="createStatsForm.Value">
                        <Form.Label>Beschreibung</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                as="textarea"
                                name="description"
                                // @ts-ignore
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Neue Shirts beim Kauf dazu."
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="createStatsForm.Goal">
                        <Form.Label>Preis</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                placeholder="100"
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="createStatsForm.Color">
                        <Form.Label>Link</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type="text"
                                name="link"
                                value={formData.link}
                                onChange={handleChange}
                                placeholder="https://app.biddz.io/"
                            />
                        </InputGroup>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Abbrechen
                </Button>
                <Button variant="success" onClick={handleAddStats}>
                    Hinzufügen
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateDeal;
