import React, { useEffect, useState, lazy, Suspense, useCallback } from 'react';
import { BlogEntryItem } from '../Types/types';
import { Spinner } from 'react-bootstrap';
import { API_BASE_URL } from '../config';
import LiveEmptyPage from './Live/LiveEmptyPage';

const LiveArticle = lazy(() => import('./Live/LiveArticle'));

function Live() {
    const [liveAuftritte, setLiveAuftritte] = useState<BlogEntryItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);

    const loadPageData = useCallback((pageNumber: number) => {
        fetch(`${API_BASE_URL}/api/live?page=${pageNumber}`)
            .then((response) => response.json())
            .then((data) => {
                if (data.length === 0) {
                    setIsLoading(false);
                    return;
                }

                const uniqueData = data.filter((newItem: BlogEntryItem) => {
                    const isDuplicate = liveAuftritte.some((existingItem) => existingItem.id === newItem.id);
                    console.log(`Checking item with id ${newItem.id}. Is duplicate: ${isDuplicate}`);
                    return !isDuplicate;
                });

                setLiveAuftritte((prevLiveAuftritte) => [...prevLiveAuftritte, ...uniqueData]);

                setPage((prevPage) => prevPage + 1);
                setIsLoading(false);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, [liveAuftritte]);

    useEffect(() => {
        loadPageData(1);
    }, [loadPageData]);

    useEffect(() => {
        const handleScroll = () => {
            const windowHeight =
                'innerHeight' in window
                    ? window.innerHeight
                    : document.documentElement.offsetHeight;
            const body = document.body;
            const html = document.documentElement;
            const docHeight = Math.max(
                body.scrollHeight,
                body.offsetHeight,
                html.clientHeight,
                html.scrollHeight,
                html.offsetHeight
            );

            const windowBottom = windowHeight + window.pageYOffset;
            if (windowBottom >= docHeight) {
                setIsLoading(true);
                loadPageData(page-1);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isLoading, page, loadPageData]);

    const imageStyle: React.CSSProperties = {
        zIndex: 1,
        width: '100%',
        height: '50vw',
        objectFit: 'cover',
        objectPosition: 'center',
    };

    return (
        <div>
            <div>
                <>
                    <video
                        src={`${API_BASE_URL}/api/uploads/live.mp4`}
                        controls={true}
                        loop
                        style={imageStyle}
                        playsInline
                    />

                    {liveAuftritte.length !== 0 ? (
                        <div className="container mt-4 mb-4">
                            {liveAuftritte.map((item, index) => (
                                <div className="row" key={index}>
                                    <div className="col-md-8 offset-md-2">
                                        <Suspense fallback={<Spinner animation="grow" />}>
                                            <LiveArticle
                                                key={index}
                                                title={item.title}
                                                description={item.description}
                                                ticket={item.ticketLink}
                                            />
                                        </Suspense>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <LiveEmptyPage />
                    )}
                </>
            </div>
        </div>
    );
}

export default Live;
