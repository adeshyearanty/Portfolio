import React from 'react';

function ProjectCard(props) {
    return (
        <div className="project-card">
            <div className='title'>{props.title}</div>
            <a href={props.id}>
                <div className="card">
                    <img src={props.imgSrc} alt="" className='projImage' />
                </div>
            </a>
        </div>
    );
}

export default ProjectCard;