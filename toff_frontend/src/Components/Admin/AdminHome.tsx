import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { useLocation, Link } from 'react-router-dom';

import AdminStats from './AdminStats';
import AdminLiveAuftritte from './AdminLiveAuftritte';

function AdminHome() {
    const location = useLocation();

    return (
        <div>
            <div className="d-flex justify-content-center align-items-center" style={{ height: '10vh' }}>
                <Nav variant="tabs">
                    <Nav.Item>
                        <Link
                            to="/admin/stats"
                            className={`nav-link ${location.pathname === '/admin/stats' ? 'active' : ''}`}
                        >
                            Stats
                        </Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link
                            to="/admin/live"
                            className={`nav-link ${location.pathname === '/admin/live' ? 'active' : ''}`}
                        >
                            Live-Auftritte
                        </Link>
                    </Nav.Item>
                </Nav>
            </div>

            {location.pathname === '/admin/stats' && <AdminStats />}
            {location.pathname === '/admin/live' && <AdminLiveAuftritte />}
        </div>
    );
}

export default AdminHome;
