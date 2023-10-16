import React, { useEffect, useState } from 'react';
import { BlogEntryItem } from '../Types/types';
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import { Image } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { API_BASE_URL } from '../config';

function Live() {
    const [liveAuftritte, setLiveAuftritte] = useState<BlogEntryItem[]>([]);

    const BuyTickets: React.CSSProperties = {
        textDecoration: 'none',
        color: 'white',
        border: '3px solid black', // Add a border
        borderRadius: '4px',
        boxShadow: '3px 3px 3px rgba(0, 0, 0, 0.4)', // Add a slight drop shadow
    };

    const RemoveLinks: React.CSSProperties = {
        textDecoration: 'none',
        color: 'white',
    }

    const gradientOverlayStyle: React.CSSProperties = {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '3%', // Adjust the height to control the fading area
        background: 'linear-gradient(transparent, white)', // Create a gradient from transparent to white
    };

    const imageStyle: React.CSSProperties = {
        zIndex: 1,
        width: "100%",
        height: "auto",
    };

    const cardStyle = {
        border: '0px', // Remove the border
        boxShadow: '7px 7px 7px rgba(0, 0, 0, 0.4)', // Add a slight drop shadow
    };

    const containerStyle = {
        maxWidth: '300px', // Adjust the maximum width as needed
    };

    useEffect(() => {
        if (liveAuftritte.length === 0) {
            // Fetch data from the backend when the component mounts
            fetch(`${API_BASE_URL}/api/live`) // Replace with your actual API endpoint
                .then((response) => response.json())
                .then((data) => setLiveAuftritte(data))
                .catch((error) => console.error('Error fetching data:', error));
        }
    }, [liveAuftritte.length]);

    return (
        <Carousel>
            {liveAuftritte.map((item, index) => (
                <Carousel.Item key={index}>
                    {item.isVideo ? ( // Check if it's a video
                        <video
                            src={`${API_BASE_URL}/api/${item.mediaSource}`}
                            autoPlay
                            muted
                            controls={false}
                            loop
                            style={imageStyle}
                        />
                    ) : ( // Otherwise, assume it's an image
                        <Image src={`${API_BASE_URL}/api/${item.mediaSource}`} alt="Image" className="img-fluid" style={imageStyle} />
                    )}
                    <div style={gradientOverlayStyle}></div>

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
                                            <a href={item.ticketLink} target="_blank" rel="noopener noreferrer" style={RemoveLinks}>
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
    );
}

export default Live;
