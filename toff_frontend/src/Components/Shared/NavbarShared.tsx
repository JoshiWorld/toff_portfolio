import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

function NavbarShared() {
    return (
        <Navbar collapseOnSelect expand="md" bg="dark" variant="dark"> {/* Set bg to "dark" */}
            <Container>
                <Navbar.Brand href="#home">
                    <img
                        src="/logo.svg"
                        width="30"
                        height="30"
                        className="d-inline-block align-top"
                        alt="TOFF Logo"
                    /> T O F F
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">
                    <Nav>
                        <Nav.Link href="#home">Home</Nav.Link>
                        <Nav.Link href="#musik">Musik</Nav.Link>
                        <Nav.Link href="#live">Live</Nav.Link>
                        <Nav.Link href="#songanteile">Songanteile</Nav.Link>
                        <Nav.Link href="#kontakt">Kontakt</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarShared;
