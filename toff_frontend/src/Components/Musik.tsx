import React, {useEffect, useState} from 'react';
import './Musik.css';
import {StatsItem} from "../Types/types";
import {API_BASE_URL} from "../config";
import MusikPlaylist from './MusikPlaylist';
import { Spinner } from 'react-bootstrap';
import { Pagination } from 'react-bootstrap';

function Musik() {
    const [stats, setStats] = useState<StatsItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 3;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const statsToDisplay = stats.slice(startIndex, endIndex);

    useEffect(() => {
        if (stats.length === 0) {
            fetch(`${API_BASE_URL}/api/stats`)
                .then((response) => response.json())
                .then((data) => {
                    const statsWithPercentage = data.map((item: StatsItem) => {
                        // @ts-ignore
                        const percentage = (item.value / item.goal) * 100;
                        const percentageString = percentage + '%';
                        return { ...item, percentageString };
                    });
                    setStats(statsWithPercentage);
                    setIsLoading(false);
                })
                .catch((error) => console.error('Error fetching data:', error));
        }
    }, [stats.length]);

    const handlePageChange = (page: number) => {
        if(page-1 === Math.ceil(stats.length / pageSize)) page = 1;
        if(page < 1) page = Math.ceil(stats.length / pageSize);
        setCurrentPage(page);
    };

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
                                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <MusikPlaylist />
                                </div>
                                {stats.length !== 0 && (
                                    <div className="mt-4 stats-container">
                                        <h1>MEILENSTEINE</h1>

                                        {stats.length > 3 && (
                                            <Pagination className="justify-content-between pagination-lg arrowsPosition">
                                                <div className="arrows-container">
                                                    <button
                                                        className="pageArrows left-arrow"
                                                        onClick={() => handlePageChange(currentPage - 1)}
                                                    >
                                                        &lt;
                                                    </button>
                                                </div>

                                                <div className="arrows-container">
                                                    <button
                                                        className="pageArrows right-arrow"
                                                        onClick={() => handlePageChange(currentPage + 1)}
                                                    >
                                                        &gt;
                                                    </button>
                                                </div>
                                            </Pagination>
                                        )}

                                        {statsToDisplay.map((data, index) => (
                                            <div key={data.id}>
                                                <div className="stats-info">
                                                    {/*// @ts-ignore*/}
                                                    <p>{data.value.toLocaleString()}</p>
                                                    {/*// @ts-ignore*/}
                                                    <p>{data.goal.toLocaleString()}</p>
                                                </div>
                                                <p id="title">
                                                    {data.title}
                                                    <span></span>
                                                    <span
                                                        className="tall"
                                                        style={{
                                                            background: data.color,
                                                            width: data.percentageString,
                                                            animationDelay: `${index * 0.05}s`,
                                                        }}
                                                    ></span>
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </article>
                </section>
            </main>
        </div>
    );



}

export default Musik;
