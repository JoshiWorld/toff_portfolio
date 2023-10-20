import React from 'react';
import './Kontakt.css';
import { API_BASE_URL } from '../config';

function KontaktSent() {
    return (
        <div className="charts">
            <div className="background-video-container">
                <video className="background-video" autoPlay muted loop controls={false}>
                    <source src={`${API_BASE_URL}/api/uploads/MUSIC_BACKGROUND.mp4`} type="video/mp4" />
                    Video not supported by your browser.
                </video>
            </div>

            <main>
                <section id="tall">
                    <article className="tall">
                        <div className="contact-form">
                            <h2>Anliegen erhalten!</h2>
                        </div>
                    </article>
                </section>
            </main>
        </div>
    );
}

export default KontaktSent;