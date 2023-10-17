import React from 'react';
import {API_BASE_URL} from "../../config";
import {Image} from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

// @ts-ignore
function CarouselItemContainer({ index, item }) {
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
        objectFit: "cover",
        objectPosition: "center",
    };


    const cardStyle = {
        border: '0px', // Remove the border
        boxShadow: '7px 7px 7px rgba(0, 0, 0, 0.4)', // Add a slight drop shadow
    };

    const containerStyle = {
        maxWidth: '300px', // Adjust the maximum width as needed
    };

    return (
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
                    <Image src={`${API_BASE_URL}/api/${item.imageSource}`} alt="Image" className="img-fluid" style={imageStyle} />
                )}
            </div>
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
    );
}

export default CarouselItemContainer;
