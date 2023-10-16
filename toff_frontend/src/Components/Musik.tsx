import React from 'react';
import './Musik.css';

function Musik() {
    const elementData = [
        { width: '95%' },
        { width: '80%' },
        { width: '90%' },
    ];

    return (
        <div className="charts">
            <main>
                <section id="tall">
                    <article className="tall">
                        <h1>STATS</h1>
                        {elementData.map((data, index) => (
                            <div key={index}>
                                <p>Test {data.width} <span></span><span className="tall" style={{ width: data.width, animationDelay: `${index * 0.05}s` }}></span></p>
                            </div>
                        ))}
                    </article>
                </section>
            </main>
        </div>
    );
}

export default Musik;
