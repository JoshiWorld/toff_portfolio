import React, { useEffect, useState } from 'react';
import { Button, Spinner, Table } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import { API_BASE_URL } from '../../config';
import { Email } from '../../Types/types';
import { useAuth } from '../../Utils/AuthProvider';
import CreateEmail from './Components/CreateEmail';

function AdminKontakt() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [emails, setEmails] = useState<Email[]>([]);
    const [editableRow, setEditableRow] = useState<number | null>(null);
    const [isCreateEmailVisible, setCreateEmailVisible] = useState(false);
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
                setIsLoading(false);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, [token]);

    const handleEditClick = (index: number) => {
        setEditableRow(index);
    };

    const handleRemoveClick = (index: number) => {
        const emailToBeRemoved = emails[index];
        fetch(`${API_BASE_URL}/api/contact/${emailToBeRemoved.id}`, {
            method: 'DELETE',
            // @ts-ignore
            headers: {
                'authorization': token
            }
        }).then((response) => {
            if(response.ok) {
                window.location.reload();
            }
        }).catch((error) => {
            console.error('Error deleting data:', error);
        });
    };

    const handleSaveClick = (index: number) => {
        const updatedEmails = [...emails];
        const updatedItem = { ...updatedEmails[index] };
        const formDataJSON = JSON.stringify({ email: updatedItem });

        fetch(`${API_BASE_URL}/api/contact/${updatedItem.id}`, {
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
                    // Handle success
                } else {
                    // Handle errors
                }
            })
            .catch((error) => {
                console.error('Error sending data to the backend:', error);
            });

        updatedEmails[index] = updatedItem;
        setEmails(updatedEmails);
        setEditableRow(null);
    };

    const handleCancelClick = () => {
        setEditableRow(null);
    };

    const handleOnHide = () => {
        setCreateEmailVisible(false);
    }

    const isRowEditable = (index: number) => index === editableRow;

    return (
        <>
            {isLoading ? (
                <Spinner animation="grow" />
            ) : (
                <Container>
                    <Table responsive="xl">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>E-Mail</th>
                            <th>Active</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {emails.map((item, index) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>
                                    {isRowEditable(index) ? (
                                        <input
                                            type="text"
                                            value={item.email}
                                            onChange={(e) => {
                                                const updatedEmails = [...emails];
                                                updatedEmails[index] = {
                                                    ...updatedEmails[index],
                                                    email: e.target.value,
                                                };
                                                setEmails(updatedEmails);
                                            }}
                                        />
                                    ) : (
                                        item.email
                                    )}
                                </td>
                                <td>
                                    {isRowEditable(index) ? (
                                        <input
                                            type="checkbox"
                                            checked={item.isActive}
                                            onChange={(e) => {
                                                const updatedEmails = [...emails];
                                                updatedEmails[index] = {
                                                    ...updatedEmails[index],
                                                    isActive: e.target.checked,
                                                };
                                                setEmails(updatedEmails);
                                            }}
                                        />
                                    ) : (
                                        item.isActive ? "Yes" : "No"
                                    )}
                                </td>


                                <td>
                                    {isRowEditable(index) ? (
                                        <div>
                                            <Button variant="success" onClick={() => handleSaveClick(index)}>Speichern</Button>
                                            <Button variant="danger" className="ms-1" onClick={handleCancelClick}>Abbrechen</Button>
                                        </div>
                                    ) : (
                                        <div>
                                            <Button variant="dark" onClick={() => handleEditClick(index)}>Bearbeiten</Button>
                                            <Button variant="danger" className="ms-1" onClick={() => handleRemoveClick(index)}>Löschen</Button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>

                    {isCreateEmailVisible ? (
                        <CreateEmail show={isCreateEmailVisible} onHide={handleOnHide} />
                    ) : (
                        <>
                            <Button variant="success" onClick={() => setCreateEmailVisible(true)}>Hinzufügen</Button>
                        </>
                    )}
                </Container>
            )}
        </>
    );
}

export default AdminKontakt;