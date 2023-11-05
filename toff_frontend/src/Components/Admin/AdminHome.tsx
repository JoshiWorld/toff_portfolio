import React, { useEffect, useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import { useLocation, Link, useNavigate } from 'react-router-dom';

import AdminStats from './AdminStats';
import AdminLiveAuftritte from './AdminLiveAuftritte';
import AdminKontakt from './AdminKontakt';
import AdminDeals from './AdminDeals';

function AdminHome() {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeComponent, setActiveComponent] = useState(<AdminStats />);

    useEffect(() => {
        switch (location.pathname) {
            case '/admin/stats':
                setActiveComponent(<AdminStats />);
                break;
            case '/admin/live':
                setActiveComponent(<AdminLiveAuftritte />);
                break;
            case '/admin/contact':
                setActiveComponent(<AdminKontakt />);
                break;
            case '/admin/deals':
                setActiveComponent(<AdminDeals />);
                break;
            default:
                navigate('/admin/stats'); // Now the navigate function is available
        }
    }, [location.pathname, navigate]);

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
                    <Nav.Item>
                        <Link
                            to="/admin/contact"
                            className={`nav-link ${location.pathname === '/admin/contact' ? 'active' : ''}`}
                        >
                            E-Mail
                        </Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link
                            to="/admin/deals"
                            className={`nav-link ${location.pathname === '/admin/deals' ? 'active' : ''}`}
                        >
                            Deals
                        </Link>
                    </Nav.Item>
                </Nav>
            </div>

            {activeComponent}
        </div>
    );
}

export default AdminHome;
