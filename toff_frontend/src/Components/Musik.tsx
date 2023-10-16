import React from 'react';
import './Musik.css';

function Musik() {
    const stats = [
        { id: 1, title: 'Spotify', value: 900, goal: 1000 },
        { id: 2, title: 'Test', value: 1005, goal: 10000 },
        { id: 3, title: 'Hallo', value: 50000, goal: 60000 },
    ];

    const statsWithPercentage = stats.map((item) => {
        const percentage = (item.value / item.goal) * 100;
        const percentageString = percentage + '%';
        return { ...item, percentageString };
    });

    return (
        <div className="charts">
            <main>
                <section id="tall">
                    <article className="tall">
                        <h1>STATS</h1>
                        {statsWithPercentage.map((data, index) => (
                            <div key={index}>
                                <p>{data.title} <span></span><span className="tall" style={{ width: data.percentageString, animationDelay: `${index * 0.05}s` }}></span></p>
                            </div>
                        ))}
                    </article>
                </section>
            </main>
        </div>
    );
}

export default Musik;
