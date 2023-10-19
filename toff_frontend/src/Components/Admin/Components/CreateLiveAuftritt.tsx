import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { InputGroup } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';
import { useAuth } from '../../../Utils/AuthProvider';
import { API_BASE_URL } from '../../../config';

// @ts-ignore
function CreateLiveAuftritt({ show, onHide }) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        ticketLink: '',
        imageSource: '',
        archived: false,
        image: File,
    });
    const [isUploading, setIsUploading] = useState(false);
    const { token } = useAuth();

    // @ts-ignore
    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            setFormData({
                ...formData,
                [name]: files[0],
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleAddLive = () => {
        const image = formData.image;
        // @ts-ignore
        delete formData.image;

        formData.description = formData.description.replace(/\n/g, '<br>');

        setIsUploading(true);

        fetch(`${API_BASE_URL}/api/live/create`, {
            method: 'POST',
            // @ts-ignore
            headers: {
                authorization: token,
            },
            body: (() => {
                const formDataNew = new FormData();
                // @ts-ignore
                formDataNew.append('image', image);
                formDataNew.append('liveblog', JSON.stringify(formData));
                return formDataNew;
            })(),
        })
            .then((response) => {
                if (response.ok) {
                    // Handle success, e.g., close the modal
                    onHide();
                } else {
                    // Handle errors
                }
            })
            .catch((error) => {
                console.error('Error sending data to the backend:', error);
            })
            .finally(() => {
                setIsUploading(false);
            });
    };

    return (
        <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>Neuen Live-Auftritt hinzufügen</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="createLiveForm.Title">
                        <Form.Label>Titel*</Form.Label>
                        <Form.Control
                            type="text"
                            name="title"
                            // @ts-ignore
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="LIVE 20.10.2023 IN LANDSBERG"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="createLiveForm.Description">
                        <Form.Label>Beschreibung*</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                as="textarea"
                                name="description"
                                // @ts-ignore
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Samstag ein neuer Auftritt"
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="createLiveForm.Tickets">
                        <Form.Label>Ticket-Link</Form.Label>
                        <InputGroup className="mb-3">
                            <Form.Control
                                type="text"
                                name="ticketLink"
                                // @ts-ignore
                                value={formData.ticketLink}
                                onChange={handleChange}
                                placeholder="https://google.de/"
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="createLiveForm.Image">
                        <Form.Label>Hintergrundbild</Form.Label>
                        <Form.Control
                            type="file"
                            name="image"
                            onChange={(e) => handleChange(e)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Abbrechen
                </Button>
                <Button variant="success" onClick={handleAddLive}>
                    {isUploading ? ( // Render the Spinner while uploading
                        <Spinner animation="border" role="status">
                            <span className="sr-only">Loading...</span>
                        </Spinner>
                    ) : (
                        'Hinzufügen'
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateLiveAuftritt;
