import * as React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// @ts-ignore
const CustomNavLink = ({ to, children }) => (
    <Nav.Link as={Link} to={to}>
        {children}
    </Nav.Link>
);

export default CustomNavLink;