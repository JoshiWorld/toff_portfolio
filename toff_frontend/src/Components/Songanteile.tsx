import React, { useEffect, useState } from 'react';
import './Songanteile.css';
import {API_BASE_URL} from "../config";
import { Spinner } from 'react-bootstrap';
import { Deal, DealSong } from '../Types/types';

// Song-Link: https://open.spotify.com/intl-de/track/3W15m8ARAUSr4oo7nGPI61?si=28fa79c4bbe24456
// Song-Link: https://open.spotify.com/intl-de/track/4joXMyRKlxq7nY6b5NipY5?si=ad2423f592704d76
//                                                  /----------ID----------?

// Biddz-Toff: https://app.biddz.io/musicians/406b36b1-5588-4be1-8cef-b59ddc6368db



function Songanteile() {
    const [songSrc, setSongSrc] = useState<String>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [deals, setDeals] = useState<Deal[]>([]);

    const decodeTrackURL = (songURL: DealSong) => {
        const match = songURL.song_id.match(/track\/([^?]+)/);

        if (match && match[1]) {
            return match[1];
        }

        return null;
    }

    useEffect(() => {
        const fetchDeals = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/deals`);
                if (!response.ok) {
                    console.error(`Error fetching deals data. Status: ${response.status}`);
                    return;
                }
                const data = await response.json();
                setDeals(data);
            } catch (error) {
                console.error('Error fetching deals data:', error);
            }
        };

        const fetchSongData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/deals/song`);
                if (!response.ok) {
                    console.error(`Error fetching song data. Status: ${response.status}`);
                    return;
                }
                const song = await response.json();
                if (song.length > 0) {
                    const trackURL = "https://open.spotify.com/embed/track/" + decodeTrackURL(song[0]) + "?utm_source=generator&theme=0";
                    setSongSrc(trackURL);
                }
            } catch (error) {
                console.error('Error fetching song data:', error);
            }
        };

        Promise.all([fetchDeals(), fetchSongData()])
            .then(() => {
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
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

                                <div className="card text-center bg-dark">
                                    <div className="card-header">
                                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <iframe title="Artist-Pick" style={{ borderRadius: '12px' }}
                                                // @ts-ignore
                                                    src={songSrc}
                                                    width="100%" height="152"
                                                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                                    loading="lazy"></iframe>
                                        </div>
                                    </div>

                                    <div className="card-body">
                                        <div className="card-group justify-content-evenly">
                                            {deals.map((deal, index) => (
                                                <div className="col-sm-3" id={'deal_' + index} key={index}>
                                                    <div className="card">
                                                        <div className="card-header">
                                                            <h5 className="card-title">{deal.title}</h5>
                                                        </div>
                                                        <div className="card-body card-content">
                                                            <p className="card-text text-black">{deal.description}</p>
                                                        </div>
                                                        <div className="card-footer">
                                                            <p className="card-subtitle text-black">Preis: {deal.price} Biddz</p>
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
