import React, { useEffect, useState } from 'react';
import { BlogEntryItem } from '../Types/types';
import Carousel from 'react-bootstrap/Carousel';
import { Spinner } from 'react-bootstrap';
import { API_BASE_URL } from '../config';
import CarouselItemContainer from "./Live/CarouselItemContainer";
import LiveEmptyPage from "./Live/LiveEmptyPage";

function Live() {
    const [liveAuftritte, setLiveAuftritte] = useState<BlogEntryItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

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


    return (
        <>
            {isLoading ? (
                <Spinner animation="grow" />
            ) : (
                <>
                    {liveAuftritte.length !== 0 ? (
                        <>
                            <Carousel>
                                {liveAuftritte.map((item, index) => (
                                    <CarouselItemContainer index={index} item={item} />
                                ))}
                            </Carousel>
                        </>
                    ) : (
                        <LiveEmptyPage />
                    )}
                </>
            )}
        </>
    );
}

export default Live;
