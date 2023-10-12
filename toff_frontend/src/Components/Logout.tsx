import React, { useEffect } from 'react';
import { useAuth } from '../Utils/AuthProvider';

function Logout() {
    const { logout } = useAuth();

    useEffect(() => {
        // Call the logout function when the component is loaded
        logout();
    }, [logout]);

    return (
        <p>Logged out</p>
    );
}

export default Logout;
