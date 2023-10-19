import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

// @ts-ignore
function LiveShowInfo({ show, onHide, item }) {
    const createMarkup = () => {
        return { __html: item.description };
    };

    return (
        <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>{item.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div dangerouslySetInnerHTML={createMarkup()} />
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
