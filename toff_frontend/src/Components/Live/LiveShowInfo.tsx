import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

// @ts-ignore
function LiveShowInfo({ show, onHide, item }) {

    return (
        <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>{item.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <p>{item.description}</p>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Schließen
                </Button>
                {item.ticketLink && (
                    <Button
                        variant="primary"
                        onClick={() => window.open(item.ticketLink, "_blank")}
                    >
                        Tickets kaufen
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
}

export default LiveShowInfo;
