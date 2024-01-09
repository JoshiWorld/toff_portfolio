import React, { useEffect, useState } from 'react';
import { Deal, DealSong } from '../../Types/types';
import Container from 'react-bootstrap/Container';
import { Table, Button, Spinner } from 'react-bootstrap';
import { useAuth } from '../../Utils/AuthProvider';
import { API_BASE_URL } from '../../config';
import { Pagination } from 'react-bootstrap';
import CreateDeal from './Components/CreateDeal';


function AdminDeals() {
    const [deals, setDeals] = useState<Deal[]>([]);
    const [songSrc, setSongSrc] = useState<DealSong[]>([]);
    const [editableRow, setEditableRow] = useState<number | null>(null);
    const [isCreateDealVisible, setCreateDealVisible] = useState(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const dealsToDisplay = deals.slice(startIndex, endIndex);
    const { token } = useAuth();

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/deals`);
                if (!response.ok) {
                    console.error('Error fetching deals data. Status: ', response.status);
                }
                const data = await response.json();
                setDeals(data);
            } catch (error) {
                console.error('Error fetching deals data:', error);
            }
        };

        const fetchSongData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/deals/song`);
                if (!response.ok) {
                    console.error('Error fetching song data. Status: ', response.status);
                }
                const song = await response.json();
                setSongSrc(song);
            } catch (error) {
                console.error('Error fetching song data:', error);
            }
        };

        Promise.all([fetchDeals(), fetchSongData()])
            .then(() => {
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [deals.length]);

    const handleEditClick = (index: number) => {
        setEditableRow(index);
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    const handleRemoveClick = (index: number) => {
        const statToBeRemoved = deals[index];
        fetch(`${API_BASE_URL}/api/deals/${statToBeRemoved.id}`, {
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
        const updatedStats = [...deals];
        const updatedItem = { ...updatedStats[index] };
        const formDataJSON = JSON.stringify({ deal: updatedItem });
        setIsLoading(true);

        fetch(`${API_BASE_URL}/api/deals/${updatedItem.id}`, {
            method: 'PUT',
            // @ts-ignore
            headers: {
                'Content-Type': 'application/json',
                'authorization': token,
            },
            body: formDataJSON,
        })
            .then(() => {
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error sending data to the backend:', error);
            });

        // Update the state if needed
        updatedStats[index] = updatedItem;
        setDeals(updatedStats);
        setEditableRow(null);
    };

    const handleSaveSong = () => {
        const updatedItem = { ...songSrc[0] };
        const formDataJSON = JSON.stringify({ deal_song: updatedItem });
        setIsLoading(true);

        fetch(`${API_BASE_URL}/api/deals/song/${updatedItem.id}`, {
            method: 'PUT',
            // @ts-ignore
            headers: {
                'Content-Type': 'application/json',
                'authorization': token,
            },
            body: formDataJSON,
        })
            .then(() => {
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error sending data to the backend:', error);
            });
    };


    const handleCancelClick = () => {
        setEditableRow(null);
    };

    const handleOnHide = () => {
        setCreateDealVisible(false);
    }


    const isRowEditable = (index: number) => index === editableRow;

    return (
        <>
            {isLoading ? (
                <Spinner animation="grow" />
            ) : (
                <Container>
                    <div className="mb-5">
                        <h4>Aktueller Song als Deal:</h4>
                        <input
                            type="text"
                            value={songSrc ? songSrc[0].song_id : ""}
                            onChange={(e) => {
                                const updatedDealSong = [...songSrc];
                                updatedDealSong[0] = {
                                    ...updatedDealSong[0],
                                    song_id: e.target.value,
                                };
                                setSongSrc(updatedDealSong);
                            }}
                        />
                        <Button className="m-lg-1" variant="success" onClick={handleSaveSong}>Speichern</Button>
                    </div>

                    <Table responsive="xl">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Titel</th>
                            <th>Beschreibung</th>
                            <th>Preis</th>
                            <th>Link</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {dealsToDisplay.map((deal, index) => (
                            <tr key={deal.id}>
                                <td>{deal.id}</td>
                                <td>
                                    {isRowEditable(index) ? (
                                        <input
                                            type="text"
                                            value={deal.title}
                                            onChange={(e) => {
                                                const updatedStats = [...deals];
                                                updatedStats[index] = {
                                                    ...updatedStats[index],
                                                    title: e.target.value,
                                                };
                                                setDeals(updatedStats);
                                            }}
                                        />
                                    ) : (
                                        deal.title
                                    )}
                                </td>
                                <td>
                                    {isRowEditable(index) ? (
                                        <input
                                            type="text"
                                            value={deal.description}
                                            onChange={(e) => {
                                                const updatedStats = [...deals];
                                                updatedStats[index] = {
                                                    ...updatedStats[index],
                                                    description: e.target.value,
                                                };
                                                setDeals(updatedStats);
                                            }}
                                        />
                                    ) : (
                                        deal.description
                                    )}
                                </td>
                                <td>
                                    {isRowEditable(index) ? (
                                        <input
                                            type="text"
                                            value={deal.price}
                                            onChange={(e) => {
                                                const updatedStats = [...deals];
                                                updatedStats[index] = {
                                                    ...updatedStats[index],
                                                    price: +e.target.value,
                                                };
                                                setDeals(updatedStats);
                                            }}
                                        />
                                    ) : (
                                        deal.price
                                    )}
                                </td>
                                <td>
                                    {isRowEditable(index) ? (
                                        <input
                                            type="text"
                                            value={deal.link}
                                            onChange={(e) => {
                                                const updatedStats = [...deals];
                                                updatedStats[index] = {
                                                    ...updatedStats[index],
                                                    link: e.target.value,
                                                };
                                                setDeals(updatedStats);
                                            }}
                                        />
                                    ) : (
                                        deal.link
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
                        {Array(Math.ceil(deals.length / itemsPerPage))
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

                    {isCreateDealVisible ? (
                        <CreateDeal show={isCreateDealVisible} onHide={handleOnHide} />
                    ) : (
                        <>
                            <Button variant="success" onClick={() => setCreateDealVisible(true)}>Erstellen</Button>
                        </>
                    )}
                </Container>
            )}
        </>
    );
}

export default AdminDeals;
