import React from 'react';

function ProjectCard(props) {
    return (
        <div className="project-card">
            <p className='title'>{props.title}</p>
            <div className={props.className}>
            </div>
        </div>
    );
}

export default ProjectCard;