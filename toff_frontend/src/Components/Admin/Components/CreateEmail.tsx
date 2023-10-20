import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { InputGroup } from 'react-bootstrap';
import { useAuth } from '../../../Utils/AuthProvider';
import { API_BASE_URL } from '../../../config';

// @ts-ignore
function CreateEmail({ show, onHide }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
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

    const handleAddEmail = () => {
        const formDataJSON = JSON.stringify({ email: formData });

        fetch(`${API_BASE_URL}/api/contact/createmail`, {
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
                <Modal.Title>Neue E-Mail hinzufügen</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="createStatsForm.Title">
                        <Form.Label>E-Mail</Form.Label>
                        <Form.Control
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="contact@toff.de"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="createStatsForm.Value">
                        <Form.Label>Passwort</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
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
                <Button variant="success" onClick={handleAddEmail}>
                    Hinzufügen
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateEmail;
