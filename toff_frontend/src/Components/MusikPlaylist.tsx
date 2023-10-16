import React from 'react';
import Container from 'react-bootstrap/Container';

function MusikPlaylist() {
    return(
        <Container>
            <iframe title="Playlist" style={{ borderRadius: '12px' }}
                    src="https://open.spotify.com/embed/playlist/2FbQOK7yDfa6Bo0QRUBIgJ?utm_source=generator"
                    width="100%" height="352" frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"></iframe>
        </Container>
    )
}

export default MusikPlaylist;