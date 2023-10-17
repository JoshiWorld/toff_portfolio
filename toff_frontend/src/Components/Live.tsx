import React, { useEffect, useState } from 'react';
import { BlogEntryItem } from '../Types/types';
import Carousel from 'react-bootstrap/Carousel';
import {Image, Spinner} from 'react-bootstrap';
import { API_BASE_URL } from '../config';
import LiveEmptyPage from "./Live/LiveEmptyPage";
import LiveShowInfo from './Live/LiveShowInfo';

function Live() {
    const [liveAuftritte, setLiveAuftritte] = useState<BlogEntryItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showInfo, setShowInfo] = useState(new Array(liveAuftritte.length).fill(false));

    useEffect(() => {
        if (liveAuftritte.length === 0) {
            // Fetch data from the backend when the component mounts
            fetch(`${API_BASE_URL}/api/live`) // Replace with your actual API endpoint
                .then((response) => response.json())
                .then((data) => {
                    setLiveAuftritte(data);
                    setIsLoading(false);
                })
                .catch((error) => console.error('Error fetching data:', error));
        }
    }, [liveAuftritte.length]);

    const imageStyle: React.CSSProperties = {
        zIndex: 1,
        width: "100%",
        height: "50vw",
        objectFit: "cover",
        objectPosition: "center",
    };

    const handleOnHide = (index: number) => {
        const updatedShowInfo = [...showInfo];
        updatedShowInfo[index] = false;
        setShowInfo(updatedShowInfo);
    };

    return (
        <div>
            <div>
                {isLoading ? (
                    <Spinner animation="grow" />
                ) : (
                    <>
                        {liveAuftritte.length !== 0 ? (
                            <Carousel>
                                {liveAuftritte.map((item, index) => (
                                    <Carousel.Item key={index}>
                                        <div>
                                            <div onClick={() => {
                                                const updatedShowInfo = [...showInfo];
                                                updatedShowInfo[index] = true;
                                                setShowInfo(updatedShowInfo);
                                            }}>
                                                {item.isVideo ? (
                                                    <video
                                                        src={`${API_BASE_URL}/api/${item.mediaSource}`}
                                                        autoPlay
                                                        muted
                                                        controls={false}
                                                        loop
                                                        style={imageStyle}
                                                    />
                                                ) : (
                                                    <Image
                                                        src={`${API_BASE_URL}/api/${item.imageSource}`}
                                                        alt="Livesource"
                                                        className="img-fluid"
                                                        style={imageStyle}
                                                    />
                                                )}
                                            </div>

                                            {showInfo[index] && (
                                                <LiveShowInfo show={showInfo[index]} onHide={() => handleOnHide(index)} item={item} />
                                            )}
                                        </div>
                                    </Carousel.Item>

                                ))}
                            </Carousel>
                        ) : (
                            <LiveEmptyPage />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Live;
