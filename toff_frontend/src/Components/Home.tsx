import React, { useEffect, useState } from 'react';
import './Home.css';
import { Spinner } from 'react-bootstrap';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faSpotify } from '@fortawesome/free-brands-svg-icons';
import {API_BASE_URL} from "../config";

function Home() {
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(false);
    }, []);

    document.documentElement.style.setProperty('--bg-image-url', `url('${API_BASE_URL}/api/uploads/home.jpg')`)

    library.add(faSpotify);
    library.add(faInstagram);

    const gradientOverlayStyle: React.CSSProperties = {
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '10%',
        background: 'linear-gradient(transparent, white)',
        zIndex: 2,
    };

    return (
        <div>
            {isLoading ? (
                <Spinner animation="grow" />
            ) : (
                <div id="intro">
                    <div className="intro-content">
                        <div className="row">
                            <div className="col-twelve">
                                <h1>TOFF</h1>
                                <p className="intro-position">
                                    <span>LANDSBERGS</span><br />
                                    <span></span>
                                    <span>BEKANNTESTER RAP ARTIST</span>
                                </p>
                                <a className="button stroke smoothscroll" href="https://open.spotify.com/intl-de/artist/35qJJVRDUxWBkMuZhkkCvz?si=v9bIR9JFSeuiIuyeTxt0nQ" target="_blank" rel="noopener noreferrer" title="">JETZT HÖREN <FontAwesomeIcon icon={faSpotify} bounce size="lg" style={{color: "#00ffaa",}} /></a>
                                <br />
                                <a className="smoothscroll instagram-button" href="https://www.instagram.com/toff.musik/" target="_blank" rel="noopener noreferrer" title=""><FontAwesomeIcon icon={faInstagram} bounce size="lg" /></a>
                            </div>
                        </div>
                    </div>

                    <div style={gradientOverlayStyle}></div>
                </div>
            )}
        </div>
    );
}

export default Home;
