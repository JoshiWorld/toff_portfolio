import React, { useEffect, useState } from 'react';
import './Songanteile.css';
import {API_BASE_URL} from "../config";
import { Spinner } from 'react-bootstrap';
import { Deal } from '../Types/types';

// Song-Link: https://open.spotify.com/intl-de/track/3W15m8ARAUSr4oo7nGPI61?si=28fa79c4bbe24456
// Song-Link: https://open.spotify.com/intl-de/track/4joXMyRKlxq7nY6b5NipY5?si=ad2423f592704d76
//                                                  /----------ID----------?

// Biddz-Toff: https://app.biddz.io/musicians/406b36b1-5588-4be1-8cef-b59ddc6368db

function Songanteile() {
    const [songSrc, setSongSrc] = useState<String>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [deals, setDeals] = useState<Deal[]>([]);

    const decodeTrackURL = (songURL: string) => {
        const match = songURL.match(/track\/([^?]+)/);

        if (match && match[1]) {
            return match[1];
        }

        return null;
    }

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/deals`)
            .then((response) => response.json())
            .then((data) => {
                setDeals(data);

                fetch(`${API_BASE_URL}/api/deals/song`).then((res) => res.json()).then((song) => {
                    setSongSrc("https://open.spotify.com/embed/track/" + decodeTrackURL(song[0]) + "?utm_source=generator&theme=0");
                    setIsLoading(false);
                }).catch((err) => console.error('Error fetchin data:', err));
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, [deals.length]);

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

                                <div className="card text-center bg-dark">
                                    <div className="card-header">
                                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <iframe title="Artist-Pick" style={{ borderRadius: '12px' }}
                                                // @ts-ignore
                                                    src={songSrc}
                                                    width="100%" height="152" frameBorder="0"
                                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                                    loading="lazy"></iframe>
                                        </div>
                                    </div>

                                    <div className="card-body">
                                        <div className="card-group justify-content-evenly">
                                            {deals.map((deal, index) => (
                                                <div className="col-sm-3" id={'deal_' + index} key={index}>
                                                    <div className="card">
                                                        <div className="card-body card-content">
                                                            <h5 className="card-title">{deal.title}</h5>
                                                            <p className="card-text text-black">{deal.description}</p>
                                                            <a href={deal.link} className="btn btn-dark">Kaufen</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

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
