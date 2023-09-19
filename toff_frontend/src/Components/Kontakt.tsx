import React from 'react';
import contactImage from '../Images/contact.png';

function Kontakt() {
    const containerStyle: React.CSSProperties = {
        maxWidth: '100%',
        height: 'auto',
        position: 'relative',
    };

    const imageStyle: React.CSSProperties = {
        maxWidth: '100%',
        width: 'auto',
        zIndex: 1,
    };

    const gradientOverlayStyle: React.CSSProperties = {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '10%',
        background: 'linear-gradient(transparent, white)',
        zIndex: 2,
    };

    return (
        <div style={containerStyle}>
            <img src={contactImage} alt="TOFF Contact" style={imageStyle} />
            <div style={gradientOverlayStyle}></div>
        </div>
    );
}

export default Kontakt;
