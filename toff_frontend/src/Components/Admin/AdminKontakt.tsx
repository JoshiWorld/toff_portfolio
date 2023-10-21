import React, { useEffect, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { API_BASE_URL } from '../../config';
import { Email } from '../../Types/types';
import { useAuth } from '../../Utils/AuthProvider';
import CreateEmail from './Components/CreateEmail';

function AdminKontakt() {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [emails, setEmails] = useState<Email[]>([]);
    const [isCreateEmailVisible, setCreateEmailVisible] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState<Email | undefined | null>(null);
    const { token } = useAuth();

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/contact`, {
            method: 'GET',
            // @ts-ignore
            headers: {
                'authorization': token
            }
        })
            .then((response) => response.json())
            .then((data) => {
                setEmails(data);
                const initialSelectedEmail = data.find((email: Email) => email.isActive);
                if (initialSelectedEmail) setSelectedEmail(initialSelectedEmail);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            });
    }, [token]);

    const handleSaveClick = () => {
        const updatedItem = {
            // @ts-ignore
            email_id: selectedEmail.id,
            // @ts-ignore
            email: selectedEmail.email,
            // @ts-ignore
            isActive: true
        }
        const formDataJSON = JSON.stringify({ email: updatedItem });

        fetch(`${API_BASE_URL}/api/contact/${updatedItem.email_id}`, {
            method: 'PUT',
            // @ts-ignore
            headers: {
                'Content-Type': 'application/json',
                'authorization': token,
            },
            body: formDataJSON,
        })
            .then((response) => {
                if (response.ok) {
                    const oldActive = emails.find(email => email.isActive);

                    if(oldActive) {
                        const oldActiveUpdated = {
                            // @ts-ignore
                            email_id: oldActive.id,
                            // @ts-ignore
                            email: oldActive.email,
                            // @ts-ignore
                            isActive: false
                        }
                        const oldActiveFormated = JSON.stringify({ email: oldActiveUpdated });

                        fetch(`${API_BASE_URL}/api/contact/${oldActiveUpdated.email_id}`, {
                            method: 'PUT',
                            // @ts-ignore
                            headers: {
                                'Content-Type': 'application/json',
                                'authorization': token,
                            },
                            body: oldActiveFormated,
                        })
                            .then((response) => {
                                if (response.ok) {
                                    console.log('Emails updated');
                                } else {
                                    // Handle errors
                                }
                            })
                            .catch((error) => {
                                console.error('Error sending data to the backend:', error);
                            });
                    }
                } else {
                    // Handle errors
                }
            })
            .catch((error) => {
                console.error('Error sending data to the backend:', error);
            });
    };

    const handleOnHide = () => {
        setCreateEmailVisible(false);
    }

    return (
        <>
            {isLoading ? (
                <Spinner animation="grow" />
            ) : (
                <Container>
                    <div>
                        <label>Aktive E-Mail auswählen:</label>
                        <select
                            value={selectedEmail ? selectedEmail.id : ''}
                            onChange={(e) => {
                                const selectedId = e.target.value;
                                const selectedEmail = emails.find((email) => email.id === parseInt(selectedId));
                                setSelectedEmail(selectedEmail);
                            }}
                        >
                            {emails.map((email) => (
                                <option key={email.id} value={email.id}>
                                    {email.email}
                                </option>
                            ))}
                        </select>
                        {/*// @ts-ignore*/}
                        <button onClick={handleSaveClick}>Speichern</button>
                    </div>

                    {isCreateEmailVisible ? (
                        <CreateEmail show={isCreateEmailVisible} onHide={handleOnHide} />
                    ) : (
                        <>
                            <Button variant="success" className="mt-4" onClick={() => setCreateEmailVisible(true)}>Hinzufügen</Button>
                        </>
                    )}
                </Container>
            )}
        </>
    );
}

export default AdminKontakt;