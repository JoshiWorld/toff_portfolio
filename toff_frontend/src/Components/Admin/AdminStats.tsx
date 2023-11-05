import React, { useEffect, useState } from 'react';
import { StatsItem } from '../../Types/types';
import Container from 'react-bootstrap/Container';
import { Table, Button, Spinner } from 'react-bootstrap';
import { useAuth } from '../../Utils/AuthProvider';
import CreateStats from './Components/CreateStats';
import { API_BASE_URL } from '../../config';
import { Pagination } from 'react-bootstrap';


function AdminStats() {
    const [stats, setStats] = useState<StatsItem[]>([]);
    const [editableRow, setEditableRow] = useState<number | null>(null);
    const [isCreateStatsVisible, setCreateStatsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const statsToDisplay = stats.slice(startIndex, endIndex);
    const { token } = useAuth();

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/stats`)
            .then((response) => response.json())
            .then((data) => {
                setStats(data);
                setIsLoading(false);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, [stats.length]);

    const handleEditClick = (index: number) => {
        setEditableRow(index);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
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

    const handleSaveClick = (index: number) => {
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
                        {statsToDisplay.map((stat, index) => (
                            <tr key={stat.id}>
                                <td>{stat.id}</td>
                                <td>
                                    {isRowEditable(index) ? (
                                        <input
                                            type="text"
                                            value={stat.title}
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
                                        stat.title
                                    )}
                                </td>
                                <td>
                                    {isRowEditable(index) ? (
                                        <input
                                            type="text"
                                            value={stat.value}
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
                                        stat.value
                                    )}
                                </td>
                                <td>
                                    {isRowEditable(index) ? (
                                        <input
                                            type="text"
                                            value={stat.goal}
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
                                        stat.goal
                                    )}
                                </td>
                                <td>
                                    {isRowEditable(index) ? (
                                        <input
                                            type="color"
                                            value={stat.color}
                                            onChange={(e) => {
                                                const updatedStats = [...stats];
                                                updatedStats[index] = {
                                                    ...updatedStats[index],
                                                    color: e.target.value,
                                                };
                                                setStats(updatedStats);
                                            }}
                                        />
                                    ) : (
                                        <div
                                            style={{
                                                width: '100%',
                                                height: '2vw',
                                                backgroundColor: stat.color,
                                            }}
                                        ></div>
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
                        {Array(Math.ceil(stats.length / itemsPerPage))
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
