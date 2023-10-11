import React, { useEffect, useState } from 'react';
import BlogEntry from './Live/BlogEntry';
import Container from 'react-bootstrap/Container';
import { Row } from 'react-bootstrap';
import { BlogEntryItem } from '../Types/types';

function Live() {
    const [liveAuftritte, setLiveAuftritte] = useState<BlogEntryItem[]>([]);

    useEffect(() => {
        if(liveAuftritte.length === 0) {
            // Fetch data from the backend when the component mounts
            fetch('http://localhost:3030/api/live') // Replace with your actual API endpoint
                .then((response) => response.json())
                .then((data) => setLiveAuftritte(data))
                .catch((error) => console.error('Error fetching data:', error));
        }
    }, []);

    return (
        <Container>
            <Row>
                {liveAuftritte.map((item, index) => (
                    <div key={index} className="col-md-4">
                        <BlogEntry item={item} />
                    </div>
                ))}
            </Row>
        </Container>
    );
}

export default Live;
