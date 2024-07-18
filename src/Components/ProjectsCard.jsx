import React from 'react'

const ProjectsCard = (props) => {
  return (
    <div id={props.id} className='project-element'>
        <div className="title">{props.title}</div>
        <div className="project-container">
            <div className="project-description">
                {props.description}
            </div>
            <a href={props.gitRepo}>
                <div className="card">
                    <img src={props.imgSrc} alt="" className='projImage' />
                </div>
            </a>
        </div>
    </div>
  )
}

export default ProjectsCard