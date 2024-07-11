import React from 'react';
import './Project.css'
import ProjectCard from './ProjectCard';
import weather from './Assets/weather.png';
import calculator from './Assets/calculator.jpg';
import elevator from './Assets/elevator.jpg';

function Project() {
    return (
        <div className="project">
            <div className="title">Projects</div>
            <div className="projects">
                <ProjectCard 
                    title = "Weather Application"
                    imgsrc = {weather}
                    className = "card-1"
                />
                <ProjectCard 
                    title = "Simple Calculator"
                    imgsrc = {calculator}
                    className = "card-2"
                />
                <ProjectCard 
                    title = "Elevator Applications"
                    imgsrc = {elevator}
                    className = "card-3"
                />
            </div>
        </div>
    );
}

export default Project;