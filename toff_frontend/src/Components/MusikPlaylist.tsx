import React from 'react';
import Container from 'react-bootstrap/Container';

function MusikPlaylist() {
    return(
        <Container>
            <iframe title="Artist" style={{ borderRadius: '12px' }}
                    src="https://open.spotify.com/embed/artist/35qJJVRDUxWBkMuZhkkCvz?utm_source=generator&theme=0"
                    width="100%" height="352" frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"></iframe>
        </Container>
    )
}

export default MusikPlaylist;
