import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { InputGroup } from 'react-bootstrap';
import { useAuth } from '../../../Utils/AuthProvider';
import { API_BASE_URL } from '../../../config';

// @ts-ignore
function CreateStats({ show, onHide }) {
    const [formData, setFormData] = useState({
        title: '',
        value: '',
        goal: '',
        color: '',
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
        if(!formData.color) formData.color = '#000000'
        const formDataJSON = JSON.stringify({ stats: formData });

        fetch(`${API_BASE_URL}/api/stats/create`, {
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
                <Modal.Title>Neue Stats hinzufügen</Modal.Title>
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
                            placeholder="Spotify"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="createStatsForm.Value">
                        <Form.Label>Wert</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type="number"
                                name="value"
                                value={formData.value}
                                onChange={handleChange}
                                placeholder="10000"
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="createStatsForm.Goal">
                        <Form.Label>Ziel</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type="number"
                                name="goal"
                                value={formData.goal}
                                onChange={handleChange}
                                placeholder="100000"
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="createStatsForm.Color">
                        <Form.Label>Farbe</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type="color"
                                name="color"
                                value={formData.color || '#000000'}
                                onChange={handleChange}
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

export default CreateStats;
