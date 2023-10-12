import * as React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { BlogEntryItem } from '../../Types/types';
import { API_BASE_URL } from '../../config';

interface BlogEntryProps {
    item: BlogEntryItem; // Use the interface to type the prop
}

function BlogEntry({ item }: BlogEntryProps) {
    const BuyTickets: React.CSSProperties = {
        textDecoration: 'none',
        color: 'white'
    }

    const cardStyle: React.CSSProperties = {
        width: '20rem',
        margin: '10px', // Add margin for spacing between cards
    };

    return (
        <Card style={cardStyle}>
            <Card.Img variant="top" src={`${API_BASE_URL}/${item.imageSource}`} />
            <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                <Card.Text>
                    {item.description}
                </Card.Text>
                {item.ticketLink ? (
                    <Button variant="dark">
                        <a href={item.ticketLink} target="_blank" rel="noopener noreferrer" style={BuyTickets}>
                            Tickets
                        </a>
                    </Button>
                ) : (
                    <Button variant="dark">
                        Freier Eintritt
                    </Button>
                )}
            </Card.Body>
        </Card>
    );
}

export default BlogEntry;