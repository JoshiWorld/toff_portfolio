import * as React from 'react';
import BlogEntry from './Live/BlogEntry';
import Container from 'react-bootstrap/Container';
import homeImage from '../Images/home.png';
import { BlogEntryItem } from '../Types/types';
import { Row } from 'react-bootstrap';

const LiveAuftritte: BlogEntryItem[] = [
    {
        title: 'First Live Auftritt',
        description: 'Live Auftritt am Landsberg See oder so',
        ticketLink: 'https://google.de',
        imageSource: homeImage,
    },
    {
        title: 'Second Live Auftritt',
        description: 'Live Auftritt am Landsberg Lech oder soooos',
        ticketLink: 'https://google.de',
        imageSource: homeImage,
    },
    {
        title: 'Second Live Auftritt',
        description: 'Live Auftritt am Landsberg Lech oder soooos',
        ticketLink: 'https://google.de',
        imageSource: homeImage,
    },
    {
        title: 'Second Live Auftritt',
        description: 'Live Auftritt am Landsberg Lech oder soooos',
        ticketLink: 'https://google.de',
        imageSource: homeImage,
    },
    {
        title: 'Second Live Auftritt',
        description: 'Live Auftritt am Landsberg Lech oder soooos',
        ticketLink: 'https://google.de',
        imageSource: homeImage,
    },
];

function Live() {
    return (
        <Container>
            <Row>
                {LiveAuftritte.map((item, index) => (
                    <div key={index} className="col-md-4">
                        <BlogEntry item={item} />
                    </div>
                ))}
            </Row>
        </Container>
    );
}

export default Live;
