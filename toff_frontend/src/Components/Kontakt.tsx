import React, { useState, useEffect } from 'react';
import './Kontakt.css';
import { API_BASE_URL } from '../config';
import { Form, Button, Col, Row, Card, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Kontakt() {
    const [formData, setFormData] = useState({
        email: '',
        contactReason: '',
        firstName: '',
        lastName: '',
        company: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate(); // Get the navigation function

    // @ts-ignore
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // @ts-ignore
    const handleSubmit = (e) => {
        e.preventDefault();

        setIsLoading(true);

        formData.contactReason = formData.contactReason.replace(/\n/g, '<br>');

        const payload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            company: formData.company,
            email: formData.email,
            contactReason: formData.contactReason,
        };

        fetch(`${API_BASE_URL}/api/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Form submitted successfully');
                    setIsSubmitted(true);
                } else {
                    console.error('Form submission failed');
                }
            })
            .catch((error) => {
                console.error('Error submitting form:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        if (isSubmitted) {
            // Use the navigate function to go to the '/kontakt/sent' route
            navigate('/kontakt/sent');
        }
    }, [isSubmitted, navigate]);

    return (
        <div className="charts">
            <div className="background-video-container">
                <video className="background-video" autoPlay muted loop controls={false} playsInline>
                    <source src={`${API_BASE_URL}/api/uploads/MUSIC_BACKGROUND.mp4`} type="video/mp4" />
                    Video not supported by your browser.
                </video>
            </div>

            <main>
                <section id="tall">
                    <article className="tall">
                        <div className="contact-form">
                            <h2>Kontaktformular</h2>
                            <Card>
                                <Card.Body>
                                    <Form onSubmit={handleSubmit}>
                                        <Row>
                                            <Form.Group as={Col} controlId="firstName">
                                                <Form.Label>Vorname*</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col} controlId="lastName">
                                                <Form.Label>Nachname*</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Form.Group>
                                            <Form.Group as={Col} controlId="lastName">
                                                <Form.Label>Firma</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="company"
                                                    value={formData.company}
                                                    onChange={handleChange}
                                                />
                                            </Form.Group>
                                        </Row>
                                        <Form.Group controlId="email">
                                            <Form.Label>E-Mail*</Form.Label>
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                        <Form.Group controlId="contactReason">
                                            <Form.Label>Anliegen*</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                name="contactReason"
                                                value={formData.contactReason}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Form.Group>
                                        <Button type="submit" className="mt-4">Senden</Button>
                                    </Form>
                                    {isLoading && (
                                        <div className="text-center mt-3">
                                            <Spinner animation="border" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </Spinner>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </div>
                    </article>
                </section>
            </main>
        </div>
    );
}

export default Kontakt;
