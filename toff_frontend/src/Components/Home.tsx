import React, { useEffect, useState } from 'react';
import homeImage from '../Images/home.jpg';
import Button from 'react-bootstrap/Button';
import './Home.css';
import { Spinner } from 'react-bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram } from '@fortawesome/free-brands-svg-icons';

function Home() {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    library.add(faInstagram);


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

    const buttonStyle: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: '71%',
        transform: 'translate(-50%, -50%)',
        zIndex: 3,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        textDecoration: 'none',
        padding: 0,
        width: '13vw',
        height: '5vw',
        fontSize: '2vw',
        whiteSpace: 'nowrap',
    };

    const buttonStyleB: React.CSSProperties = {
        position: 'absolute',
        top: '60%',
        left: '71%',
        transform: 'translate(-50%, -50%)',
        zIndex: 3,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        border: 'none',
        textDecoration: 'none',
        padding: 0,
        width: '13vw',
        height: '5vw',
        fontSize: '2vw',
        whiteSpace: 'nowrap',
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

                    <a href="https://www.instagram.com/toff.musik/" target="_blank" rel="noopener noreferrer" style={buttonStyleA} >
                        <Button className="responsive-button" style={buttonStyleB}><FontAwesomeIcon icon={faInstagram} /></Button>
                    </a>
                </div>
            )}
        </>
    );
}

export default Home;
