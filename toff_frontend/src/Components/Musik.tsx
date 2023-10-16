import React, {useEffect, useState} from 'react';
import './Musik.css';
import {StatsItem} from "../Types/types";
import {API_BASE_URL} from "../config";
import MusikPlaylist from './MusikPlaylist';

function Musik() {
    const [stats, setStats] = useState<StatsItem[]>([]);

    useEffect(() => {
        if (stats.length === 0) {
            // Fetch data from the backend when the component mounts
            fetch(`${API_BASE_URL}/api/stats`) // Replace with your actual API endpoint
                .then((response) => response.json())
                .then((data) => {
                    // Calculate the percentageString for each item in the data
                    const statsWithPercentage = data.map((item: StatsItem) => {
                        // @ts-ignore
                        const percentage = (item.value / item.goal) * 100;
                        const percentageString = percentage + '%';
                        return { ...item, percentageString };
                    });
                    // Set the stats state with the calculated data
                    setStats(statsWithPercentage);
                })
                .catch((error) => console.error('Error fetching data:', error));
        }
    }, [stats.length]);

    return (
        <div className="charts">
            <main>
                <section id="tall">
                    <article className="tall">
                        <MusikPlaylist />
                        {stats.length !== 0 && (
                            <>
                                <h1>STATS</h1>
                                {stats.map((data, index) => (
                                    <div key={index}>
                                        <div className="stats-info">
                                            {/*// @ts-ignore*/}
                                            <p>{data.value.toLocaleString()}</p>
                                            {/*// @ts-ignore*/}
                                            <p>{data.goal.toLocaleString()}</p>
                                        </div>

                                        <p>{data.title}
                                            <span>

                                            </span>
                                            <span className="tall" style={{ background: data.color, width: data.percentageString, animationDelay: `${index * 0.05}s` }}>

                                            </span>
                                        </p>
                                    </div>
                                ))}
                            </>
                        )}
                    </article>
                </section>
            </main>
        </div>
    );


}

export default Musik;
