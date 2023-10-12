import React, { useEffect, useState } from 'react';
import { StatsItem } from '../../Types/types';
import Container from 'react-bootstrap/Container';
import { Table, Button } from 'react-bootstrap';
import { useAuth } from '../../Utils/AuthProvider';
import CreateStats from './Components/CreateStats';
import { API_BASE_URL } from '../../config';

function AdminStats() {
    const [stats, setStats] = useState<StatsItem[]>([]);
    const [editableRow, setEditableRow] = useState<number | null>(null);
    const [isCreateStatsVisible, setCreateStatsVisible] = useState(false);
    const { token } = useAuth();

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/stats`)
            .then((response) => response.json())
            .then((data) => setStats(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const handleEditClick = (index: number) => {
        setEditableRow(index);
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
        <Container>
            <Table responsive="xl">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Titel</th>
                    <th>Wert</th>
                    <th>Ziel</th>
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

            {isCreateStatsVisible ? (
                <CreateStats show={isCreateStatsVisible} onHide={handleOnHide} />
            ) : (
                <>
                    <Button variant="success" onClick={() => setCreateStatsVisible(true)}>Erstellen</Button>
                </>
            )}
        </Container>
    );
}

export default AdminStats;
