import React, { useEffect, useState } from 'react';
import homeImage from '../Images/home.jpg';
import Button from 'react-bootstrap/Button';
import './Home.css';
import { Spinner } from 'react-bootstrap';

function Home() {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);


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
        height: '10%', // Adjust the height to control the fading area
        background: 'linear-gradient(transparent, white)', // Create a gradient from transparent to white
        zIndex: 2, // Ensure the overlay is above the image
    };

    const buttonStyle: React.CSSProperties = {
        position: 'absolute',
        top: '50%', // Vertically center the button relative to the picture
        left: '71%', // Adjust the left position as needed relative to the picture
        transform: 'translate(-50%, -50%)', // Center the button
        zIndex: 3, // Ensure the button is above the overlay
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        textDecoration: 'none',
        padding: 0,
        width: '13vw',
        height: '5vw',
        fontSize: '2vw',
        whiteSpace: 'nowrap', // Prevent text from breaking into two lines
    };

    const buttonStyleA: React.CSSProperties = {
        textDecoration: 'none',
        color: 'black',
    }

    return (
        <>
            {isLoading ? (
                <Spinner animation="grow" />
            ) : (
                <div style={containerStyle}>
                    <img src={homeImage} alt="TOFF Home" style={imageStyle} />
                    <div style={gradientOverlayStyle}></div>

                    <a href="https://open.spotify.com/intl-de/artist/35qJJVRDUxWBkMuZhkkCvz?si=v9bIR9JFSeuiIuyeTxt0nQ" target="_blank" rel="noopener noreferrer" style={buttonStyleA} >
                        <Button className="responsive-button" style={buttonStyle}>JETZT HÖREN</Button>
                    </a>

                    {/*<div className="overlay">*/}
                    {/*    <a href="https://open.spotify.com/intl-de/artist/35qJJVRDUxWBkMuZhkkCvz?si=v9bIR9JFSeuiIuyeTxt0nQ" target="_blank" rel="noopener noreferrer" ></a>*/}
                    {/*</div>*/}
                </div>
            )}
        </>
    );
}

export default Home;
