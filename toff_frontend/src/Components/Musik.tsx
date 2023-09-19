import * as React from 'react';
import Container from 'react-bootstrap/Container';

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

function Musik() {
    return (
        <div>
            <SpotifyPlaylist />
        </div>
    );
}

export default Musik;