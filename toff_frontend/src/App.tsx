import React from 'react';
import './App.css';
import NavbarShared from './Components/Shared/NavbarShared';
import Home from './Components/Home';
import FooterShared from './Components/Shared/FooterShared';
import Musik from './Components/Musik';
import NoMatch from './Components/Shared/NoMatch';
import Kontakt from './Components/Kontakt';
import Live from './Components/Live';
import Impressum from './Components/Impressum';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AdminHome from './Components/Admin/AdminHome';
import Unauthorized from './Components/Unauthorized';
import { AuthProvider, useAuth } from './Utils/AuthProvider';

function App() {
    return (
        <div className="App">
            <Router>
                <AuthProvider>
                    <NavbarShared />
                    <Routes>
                        <Route index element={<Home />} />
                        <Route path="/musik" element={<Musik />} />
                        <Route path="/kontakt" element={<Kontakt />} />
                        <Route path="/live" element={<Live />} />
                        <Route path="/impressum" element={<Impressum />} />

                        <Route path="/admin/*">
                            <Route index element={<ProtectedRoute><AdminHome /></ProtectedRoute>} />
                        </Route>

                        <Route path="/unauthorized" element={<Unauthorized />} />
                        <Route path="*" element={<NoMatch />} />
                    </Routes>

                    <FooterShared />
                </AuthProvider>
            </Router>
        </div>
    );
}

// @ts-ignore
const ProtectedRoute = ({ children }) => {
    const { token, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        // Loading indicator, you can replace this with your preferred UI
        return <div>Loading...</div>;
    }

    if (!token) {
        return <Navigate to="/unauthorized" replace state={{ from: location }} />;
    }

    return children;
};


export default App;
