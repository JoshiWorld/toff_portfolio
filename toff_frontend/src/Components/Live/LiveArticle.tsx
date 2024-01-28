import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

// @ts-ignore
const LiveArticle = ({ title, description, ticket }) => {
    return (
        <div className="card mb-3 shadow border-0">
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text">{description}</p>
                <p className="card-text">
                    <a className="btn btn-dark" href={ticket}>Tickets</a>
                </p>
            </div>
        </div>
    );
};

export default LiveArticle;