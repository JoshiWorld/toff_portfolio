import React, { useEffect, useState } from 'react';
import { BlogEntryItem } from '../../Types/types';
import Container from 'react-bootstrap/Container';
import { Table, Button } from 'react-bootstrap';
import { useAuth } from '../../Utils/AuthProvider';
import { API_BASE_URL } from '../../config';
import CreateLiveAuftritt from './Components/CreateLiveAuftritt';

function AdminLiveAuftritte() {
    const [liveAuftritte, setLiveAuftritte] = useState<BlogEntryItem[]>([]);
    const [editableRow, setEditableRow] = useState<number | null>(null);
    const [isCreateLiveVisible, setCreateLiveVisible] = useState(false);
    const { token } = useAuth();

    useEffect(() => {
        if (liveAuftritte.length === 0) {
            // Fetch data from the backend when the component mounts
            fetch(`${API_BASE_URL}/api/live`) // Replace with your actual API endpoint
                .then((response) => response.json())
                .then((data) => setLiveAuftritte(data))
                .catch((error) => console.error('Error fetching data:', error));
        }
    }, [liveAuftritte.length]);

    const handleEditClick = (index: number) => {
        setEditableRow(index);
    };

    const handleSaveClick = (index: number, item: BlogEntryItem) => {
        const updatedLiveAuftritte = [...liveAuftritte];
        const updatedItem = { ...updatedLiveAuftritte[index] };
        const image = updatedItem.image;
        delete updatedItem.image;

        fetch(`${API_BASE_URL}/api/live/${updatedItem.id}`, {
            method: 'PUT',
            // @ts-ignore
            headers: {
                'authorization': token,
            },
            body: (() => {
                const formData = new FormData();
                // @ts-ignore
                formData.append('image', image);
                formData.append('item', JSON.stringify(updatedItem));
                return formData;
            })(),
        })
            .then((response) => {
                if (response.ok) {
                    // Handle success
                    // You may want to update the state or perform other actions
                } else {
                    // Handle errors
                }
            })
            .catch((error) => {
                console.error('Error sending data to the backend:', error);
            });

        // Update the state if needed
        updatedLiveAuftritte[index] = updatedItem;
        setLiveAuftritte(updatedLiveAuftritte);
        setEditableRow(null);
    };


    const handleCancelClick = () => {
        setEditableRow(null);
    };

    const handleOnHide = () => {
        setCreateLiveVisible(false);
    }


    const isRowEditable = (index: number) => index === editableRow;

    return (
        <Container>
            <Table responsive="xl">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Titel</th>
                    <th>Beschreibung</th>
                    <th>Tickets</th>
                    <th>Bild</th>
                    <th>Archiviert</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {liveAuftritte.map((item, index) => (
                    <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>
                            {isRowEditable(index) ? (
                                <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => {
                                        const updatedLiveAuftritte = [...liveAuftritte];
                                        updatedLiveAuftritte[index] = {
                                            ...updatedLiveAuftritte[index],
                                            title: e.target.value,
                                        };
                                        setLiveAuftritte(updatedLiveAuftritte);
                                    }}
                                />
                            ) : (
                                item.title
                            )}
                        </td>
                        <td>
                            {isRowEditable(index) ? (
                                <input
                                    type="text"
                                    value={item.description}
                                    onChange={(e) => {
                                        const updatedLiveAuftritte = [...liveAuftritte];
                                        updatedLiveAuftritte[index] = {
                                            ...updatedLiveAuftritte[index],
                                            description: e.target.value,
                                        };
                                        setLiveAuftritte(updatedLiveAuftritte);
                                    }}
                                />
                            ) : (
                                item.description
                            )}
                        </td>
                        <td>
                            {isRowEditable(index) ? (
                                <input
                                    type="text"
                                    value={item.ticketLink}
                                    onChange={(e) => {
                                        const updatedLiveAuftritte = [...liveAuftritte];
                                        updatedLiveAuftritte[index] = {
                                            ...updatedLiveAuftritte[index],
                                            ticketLink: e.target.value,
                                        };
                                        setLiveAuftritte(updatedLiveAuftritte);
                                    }}
                                />
                            ) : (
                                item.ticketLink
                            )}
                        </td>
                        <td>
                            {isRowEditable(index) ? (
                                <input
                                    type="file"
                                    accept=".png, .jpg, .jpeg"
                                    onChange={(e) => {
                                        const updatedLiveAuftritte = [...liveAuftritte];
                                        updatedLiveAuftritte[index] = {
                                            ...updatedLiveAuftritte[index],
                                            // @ts-ignore
                                            image: e.target.files[0],
                                        };
                                        setLiveAuftritte(updatedLiveAuftritte);
                                    }}
                                />
                            ) : item.imageSource ? (
                                <img
                                    src={`http://localhost:3030/${item.imageSource}`}
                                    alt="Source"
                                    style={{ maxWidth: '30%', maxHeight: '30%', width: '30', height: 'auto' }}
                                />
                            ) : (
                                'Kein Bild'
                            )}
                        </td>

                        <td>
                            {isRowEditable(index) ? (
                                <input
                                    type="checkbox"
                                    checked={item.archived}
                                    onChange={(e) => {
                                        // Update the archived field when the checkbox is toggled
                                        const updatedLiveAuftritte = [...liveAuftritte];
                                        updatedLiveAuftritte[index] = {
                                            ...updatedLiveAuftritte[index],
                                            archived: e.target.checked,
                                        };
                                        setLiveAuftritte(updatedLiveAuftritte);
                                    }}
                                />
                            ) : (
                                // Display "Yes" or "No" based on the archived state when not in edit mode
                                item.archived ? "Yes" : "No"
                            )}
                        </td>

                        <td>
                            {isRowEditable(index) ? (
                                <div>
                                    <Button variant="success" onClick={() => handleSaveClick(index, item)}>Save</Button>
                                    <Button variant="danger" className="ms-1" onClick={handleCancelClick}>Cancel</Button>
                                </div>
                            ) : (
                                <Button variant="dark" onClick={() => handleEditClick(index)}>Edit</Button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>

            {isCreateLiveVisible ? (
                <CreateLiveAuftritt show={isCreateLiveVisible} onHide={handleOnHide} />
            ) : (
                <>
                    <Button variant="success" onClick={() => setCreateLiveVisible(true)}>Erstellen</Button>
                </>
            )}
        </Container>
    );
}

export default AdminLiveAuftritte;
