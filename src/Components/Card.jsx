import React from 'react';

function Card(props) {
    return (
        <div className="list">
            <div className="company"><span className="duration">{props.duration}</span><span><strong>{props.company}</strong>{props.comp_desc}</span></div>
            <div className="role"><strong>{props.role}</strong></div>
            <div className="desc">{props.description}</div>
        </div>
    );
}

export default Card;