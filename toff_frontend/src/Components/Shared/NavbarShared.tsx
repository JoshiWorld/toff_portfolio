import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import CustomNavLink from './CustomNavLink';
import { useAuth } from '../../Utils/AuthProvider';

function NavbarShared() {
    const {token} = useAuth();

    return (
        <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
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
                        <CustomNavLink to="/">Home</CustomNavLink>
                        <CustomNavLink to="/musik">Musik</CustomNavLink>
                        <CustomNavLink to="/live">Live</CustomNavLink>
                        <CustomNavLink to="/songanteile">Songanteile</CustomNavLink>
                        <CustomNavLink to="/kontakt">Kontakt</CustomNavLink>
                        {token && <CustomNavLink to="/admin">Admin</CustomNavLink>}
                        {token && <CustomNavLink to="/logout">Logout</CustomNavLink>}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarShared;
