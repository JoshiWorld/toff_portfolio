import React, { useEffect, useState } from 'react';
import './Songanteile.css';
import {API_BASE_URL} from "../config";
import { Spinner } from 'react-bootstrap';

// Song-Link: https://open.spotify.com/intl-de/track/3W15m8ARAUSr4oo7nGPI61?si=28fa79c4bbe24456
// Song-Link: https://open.spotify.com/intl-de/track/4joXMyRKlxq7nY6b5NipY5?si=ad2423f592704d76
//                                                  /----------ID----------?

// Biddz-Toff: https://app.biddz.io/musicians/406b36b1-5588-4be1-8cef-b59ddc6368db

function Songanteile() {
    const [songSrc, setSongSrc] = useState<String>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const songUUID = "4joXMyRKlxq7nY6b5NipY5";
        setSongSrc("https://open.spotify.com/embed/track/" + songUUID + "?utm_source=generator&theme=0");
        setIsLoading(false);
    }, []);

    return (
        <div className="charts">
            <div className="background-video-container">
                <video className="background-video" autoPlay muted loop controls={false} playsInline>
                    <source src={`${API_BASE_URL}/api/uploads/MUSIC_BACKGROUND.mp4`} type="video/mp4" />
                    Video not supported by your browser.
                </video>
            </div>

            <main>
                <section id="tall">
                    <article className="tall">
                        {isLoading ? (
                            <Spinner animation="grow" />
                        ) : (
                            <>
                                <h1>Aktueller Biddz-Deal</h1>

                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <iframe title="Artist-Pick" style={{ borderRadius: '12px' }}
                                            // @ts-ignore
                                            src={songSrc}
                                            width="100%" height="152" frameBorder="0"
                                            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                            loading="lazy"></iframe>
                                </div>
                            </>
                        )}
                    </article>
                </section>
            </main>
        </div>
    );
}

export default Songanteile;
