import React, { useEffect, useState } from 'react';
import { BlogEntryItem } from '../Types/types';
import Carousel from 'react-bootstrap/Carousel';
import {Image, Spinner} from 'react-bootstrap';
import { API_BASE_URL } from '../config';
import LiveEmptyPage from "./Live/LiveEmptyPage";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

function Live() {
    const [liveAuftritte, setLiveAuftritte] = useState<BlogEntryItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (liveAuftritte.length === 0) {
            // Fetch data from the backend when the component mounts
            fetch(`${API_BASE_URL}/api/live`) // Replace with your actual API endpoint
                .then((response) => response.json())
                .then((data) => {
                    setLiveAuftritte(data);
                    setIsLoading(false);
                })
                .catch((error) => console.error('Error fetching data:', error));
        }
    }, [liveAuftritte.length]);

    const BuyTickets: React.CSSProperties = {
        textDecoration: 'none',
        color: 'white',
        border: '3px solid black',
        borderRadius: '4px',
        boxShadow: '3px 3px 3px rgba(0, 0, 0, 0.4)',
    };

    const RemoveLinks: React.CSSProperties = {
        textDecoration: 'none',
        color: 'white',
    }

    const imageStyle: React.CSSProperties = {
        zIndex: 1,
        width: "100%",
        height: "auto",
        objectFit: "cover",
        objectPosition: "center",
    };

    const cardStyle = {
        border: '0px',
        boxShadow: '7px 7px 7px rgba(0, 0, 0, 0.4)',
    };

    const containerStyle = {
        maxWidth: '300px',
    };


    return (
        <div className="container mt-3">
            {isLoading ? (
                <Spinner animation="grow" />
            ) : (
                <>
                    {liveAuftritte.length !== 0 ? (
                        <Carousel style={{ boxShadow: '10px 10px 10px rgba(0, 0, 0, 0.4)', borderRadius: "5px", }}>
                            {liveAuftritte.map((item, index) => (
                                <Carousel.Item key={index}>
                                    <div>
                                        {item.isVideo ? (
                                            <video
                                                src={`${API_BASE_URL}/api/${item.mediaSource}`}
                                                autoPlay
                                                muted
                                                controls={false}
                                                loop
                                                style={imageStyle}
                                            />
                                        ) : (
                                            <Image src={`${API_BASE_URL}/api/${item.imageSource}`} alt="Livesource" className="img-fluid"
                                                   style={imageStyle}/>
                                        )}
                                    </div>

                                    <Carousel.Caption>
                                        <Container style={containerStyle}>
                                            <Card style={cardStyle}>
                                                <Card.Header>{item.title}</Card.Header>
                                                <Card.Body>
                                                    <Card.Text>
                                                        {item.description}
                                                    </Card.Text>
                                                    <Button variant="dark" style={BuyTickets}>
                                                        {item.ticketLink ? (
                                                            <a href={item.ticketLink} target="_blank" rel="noopener noreferrer"
                                                               style={RemoveLinks}>
                                                                Tickets
                                                            </a>
                                                        ) : (
                                                            'Freier Eintritt'
                                                        )}
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        </Container>
                                    </Carousel.Caption>
                                </Carousel.Item>
                            ))}
                        </Carousel>
                    ) : (
                        <LiveEmptyPage />
                    )}
                </>
            )}
        </div>
    );
}

export default Live;
