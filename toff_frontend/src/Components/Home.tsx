import React from 'react';
import homeImage from '../Images/home.png';

function Home() {
    const imageContainerStyle: React.CSSProperties = {
        maxWidth: '100%',
        height: 'auto',
        position: 'relative',
    };

    const gradientOverlayStyle: React.CSSProperties = {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '10%', // Adjust the height to control the fading area
        background: 'linear-gradient(transparent, white)', // Create a gradient from transparent to white
        pointerEvents: 'none', // Allow clicks to pass through the overlay
    };

    const imageStyle: React.CSSProperties = {
        maxWidth: '100%',
        maxHeight: '100%',
        width: 'auto',
        height: 'auto',
        zIndex: 1, // Ensure the image is above the gradient overlay
    };

    return (
        <div style={imageContainerStyle}>
            <div style={gradientOverlayStyle}></div>
            <img src={homeImage} alt="TOFF Home Picture" style={imageStyle} />
        </div>
    );
}

export default Home;
