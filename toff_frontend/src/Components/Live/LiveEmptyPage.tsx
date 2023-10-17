import React from 'react';
import {Spinner} from "react-bootstrap";
import Container from "react-bootstrap/Container";

function LiveEmptyPage() {
    return(
        <Container fluid={true}>
            <Spinner animation="grow" />
        </Container>
    );
}

export default LiveEmptyPage;
