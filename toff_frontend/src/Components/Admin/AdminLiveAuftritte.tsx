import React, { useEffect, useState } from 'react';
import { BlogEntryItem } from '../../Types/types';
import Container from 'react-bootstrap/Container';
import { Table, Button, Spinner } from 'react-bootstrap';
import { useAuth } from '../../Utils/AuthProvider';
import { API_BASE_URL } from '../../config';
import CreateLiveAuftritt from './Components/CreateLiveAuftritt';
import { Pagination } from 'react-bootstrap';

function AdminLiveAuftritte() {
    const [liveAuftritte, setLiveAuftritte] = useState<BlogEntryItem[]>([]);
    const [editableRow, setEditableRow] = useState<number | null>(null);
    const [isCreateLiveVisible, setCreateLiveVisible] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const liveAuftritteToDisplay = liveAuftritte.slice(startIndex, endIndex);
    const { token } = useAuth();

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/live`)
            .then((response) => response.json())
            .then((data) => {
                setLiveAuftritte(data);
                setIsLoading(false);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, [liveAuftritte.length]);

    const handleEditClick = (index: number) => {
        setEditableRow(index);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleRemoveClick = (index: number) => {
        const liveToBeRemoved = liveAuftritte[index];
        fetch(`${API_BASE_URL}/api/live/${liveToBeRemoved.id}`, {
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
            // Handle any errors, e.g., display an error message
            console.error('Error deleting data:', error);
        });
    };

    const handleSaveClick = (index: number) => {
        const updatedLiveAuftritte = [...liveAuftritte];
        const updatedItem = { ...updatedLiveAuftritte[index] };
        const image = updatedItem.image;
        delete updatedItem.image;

        updatedItem.description = updatedItem.description.replace(/\n/g, '<br>');

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
        <>
            {isLoading ? (
                <Spinner animation="grow" />
            ) : (
                <Container>
                    <Table responsive="xl">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Titel</th>
                            <th>Beschreibung</th>
                            <th>Tickets</th>
                            <th>Bild/Video</th>
                            <th>Archiviert</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {liveAuftritteToDisplay.map((item, index) => (
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
                                        <textarea
                                            value={item.description.replace(/<br\s*\/?>/g, '\n')} // Convert <br> tags to newlines
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
                                        <div
                                            dangerouslySetInnerHTML={{ __html: item.description.replace(/\n/g, '<br />') }}
                                            style={{ whiteSpace: 'pre-line' }}
                                        />
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
                                            accept=".png, .jpg, .jpeg, .mp4, .mkv, .mov, .avi"
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
                                            src={`${API_BASE_URL}/api/${item.imageSource}`}
                                            alt="Source"
                                            style={{ maxWidth: '30%', maxHeight: '30%', width: '30', height: 'auto' }}
                                        />
                                    ) : item.mediaSource ? (
                                        <video
                                            src={`${API_BASE_URL}/api/${item.mediaSource}`}
                                            muted
                                            autoPlay
                                            controls={false}
                                            loop
                                            style={{ maxWidth: '30%', maxHeight: '30%', width: '30', height: 'auto' }}
                                        />
                                    ) : (
                                        'Kein Bild oder Video'
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

                    <Pagination>
                        {Array(Math.ceil(liveAuftritte.length / itemsPerPage))
                            .fill(null)
                            .map((_, page) => (
                                <Pagination.Item
                                    key={page}
                                    active={page + 1 === currentPage}
                                    onClick={() => handlePageChange(page + 1)}
                                >
                                    {page + 1}
                                </Pagination.Item>
                            ))}
                    </Pagination>

                    {isCreateLiveVisible ? (
                        <CreateLiveAuftritt show={isCreateLiveVisible} onHide={handleOnHide} />
                    ) : (
                        <>
                            <Button variant="success" onClick={() => setCreateLiveVisible(true)}>Erstellen</Button>
                        </>
                    )}
                </Container>
            )}
        </>
    );
}

export default AdminLiveAuftritte;
