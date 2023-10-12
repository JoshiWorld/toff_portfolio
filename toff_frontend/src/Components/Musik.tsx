import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import './Musik.css';

function SpotifyPlaylist() {
    const iframeStyle = {
        borderRadius: '12px',
    };

    return (
        <Container>
            <iframe
                style={iframeStyle} // Apply the style object here
                src="https://open.spotify.com/embed/playlist/2FbQOK7yDfa6Bo0QRUBIgJ?utm_source=generator&theme=0"
                width="100%"
                height="352"
                title="playlist"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
            ></iframe>
        </Container>
    );
}

const Chart = () => {
    const [data] = useState({
        labels: ['Eating', 'Drinking', 'Sleeping', 'Designing', 'Coding', 'Cycling', 'Running'],
        datasets: [
            {
                label: 'My First dataset',
                backgroundColor: 'rgba(194, 116, 161, 0.5)',
                borderColor: 'rgb(194, 116, 161)',
                data: [65, 59, 90, 81, 56, 55, 40],
            },
            {
                label: 'My Second dataset',
                backgroundColor: 'rgba(71, 225, 167, 0.5)',
                borderColor: 'rgb(71, 225, 167)',
                data: [28, 48, 40, 19, 96, 27, 100],
            },
        ],
    });
};

function Musik() {
    return (
        <div className="charts">
            <main>
                <section id="tall">
                    <article className="tall">
                        <h1>STATS</h1>
                        <div>
                            <p>Test <span></span><span className="tall"></span></p>
                        </div>
                        <div>
                            <p>Test2 <span></span><span className="tall"></span></p>
                        </div>
                        <div>
                            <p>Test3 <span></span><span className="tall"></span></p>
                        </div>
                    </article>
                </section>
            </main>
        </div>
    );
}

export default Musik;