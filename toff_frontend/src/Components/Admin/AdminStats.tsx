import React, { useEffect, useState } from 'react';
import { StatsItem } from '../../Types/types';
import Container from 'react-bootstrap/Container';
import { Table, Button, Spinner } from 'react-bootstrap';
import { useAuth } from '../../Utils/AuthProvider';
import CreateStats from './Components/CreateStats';
import { API_BASE_URL } from '../../config';

function AdminStats() {
    const [stats, setStats] = useState<StatsItem[]>([]);
    const [editableRow, setEditableRow] = useState<number | null>(null);
    const [isCreateStatsVisible, setCreateStatsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { token } = useAuth();

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/stats`)
            .then((response) => response.json())
            .then((data) => {
                setStats(data);
                setIsLoading(false);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const handleEditClick = (index: number) => {
        setEditableRow(index);
    };

    const handleRemoveClick = (index: number) => {
        const statToBeRemoved = stats[index];
        fetch(`${API_BASE_URL}/api/stats/${statToBeRemoved.id}`, {
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

    const handleSaveClick = (index: number, item: StatsItem) => {
        const updatedStats = [...stats];
        const updatedItem = { ...updatedStats[index] };
        const formDataJSON = JSON.stringify({ stats: updatedItem });

        fetch(`${API_BASE_URL}/api/stats/${updatedItem.id}`, {
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
                    // You may want to update the state or perform other actions
                } else {
                    // Handle errors
                }
            })
            .catch((error) => {
                console.error('Error sending data to the backend:', error);
            });

        // Update the state if needed
        updatedStats[index] = updatedItem;
        setStats(updatedStats);
        setEditableRow(null);
    };


    const handleCancelClick = () => {
        setEditableRow(null);
    };

    const handleOnHide = () => {
        setCreateStatsVisible(false);
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
                            <th>Wert</th>
                            <th>Ziel</th>
                            <th>Farbe</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {stats.map((item, index) => (
                            <tr key={item.id}>
                                <td>{item.id}</td>
                                <td>
                                    {isRowEditable(index) ? (
                                        <input
                                            type="text"
                                            value={item.title}
                                            onChange={(e) => {
                                                const updatedStats = [...stats];
                                                updatedStats[index] = {
                                                    ...updatedStats[index],
                                                    title: e.target.value,
                                                };
                                                setStats(updatedStats);
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
                                            value={item.value}
                                            onChange={(e) => {
                                                const updatedStats = [...stats];
                                                updatedStats[index] = {
                                                    ...updatedStats[index],
                                                    value: +e.target.value,
                                                };
                                                setStats(updatedStats);
                                            }}
                                        />
                                    ) : (
                                        item.value
                                    )}
                                </td>
                                <td>
                                    {isRowEditable(index) ? (
                                        <input
                                            type="text"
                                            value={item.goal}
                                            onChange={(e) => {
                                                const updatedStats = [...stats];
                                                updatedStats[index] = {
                                                    ...updatedStats[index],
                                                    goal: +e.target.value,
                                                };
                                                setStats(updatedStats);
                                            }}
                                        />
                                    ) : (
                                        item.goal
                                    )}
                                </td>
                                <td>
                                    {isRowEditable(index) ? (
                                        <input
                                            type="color"
                                            value={item.color}
                                            onChange={(e) => {
                                                const updatedStats = [...stats];
                                                updatedStats[index] = {
                                                    ...updatedStats[index],
                                                    color: e.target.value, // Update the color based on the selected color
                                                };
                                                setStats(updatedStats);
                                            }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: '100%',
                                                height: '2vw',
                                                backgroundColor: item.color,
                                            }}
                                        ></div>
                                    )}
                                </td>


                                <td>
                                    {isRowEditable(index) ? (
                                        <div>
                                            <Button variant="success" onClick={() => handleSaveClick(index, item)}>Speichern</Button>
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

                    {isCreateStatsVisible ? (
                        <CreateStats show={isCreateStatsVisible} onHide={handleOnHide} />
                    ) : (
                        <>
                            <Button variant="success" onClick={() => setCreateStatsVisible(true)}>Erstellen</Button>
                        </>
                    )}
                </Container>
            )}
        </>
    );
}

export default AdminStats;
