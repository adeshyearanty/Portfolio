import React from 'react';
import './Static/Project.css'
import ProjectCard from './ProjectCard';
import bookStore from './Assets/bookStore.png'
import elevator from './Assets/elevator.jpg'
import weather from './Assets/weather.png'

function Project() {
    return (
        <div className="project" id='projects'>
            <div className="title">Projects</div>
            <div className="projects">
                <ProjectCard 
                    id = "#weather-card"
                    title = "Weather Application"
                    imgSrc = {weather}
                    gitRepo = "https://github.com/adeshyearanty/Weather-Application"
                />
                <ProjectCard 
                    id = "#book-store-card"
                    title = "Book Store"
                    imgSrc = {bookStore}
                    gitRepo = "https://github.com/adeshyearanty/book-store-MERN"
                />
                <ProjectCard 
                    id = "#elevator-card"
                    title = "Elevator Applications"
                    imgSrc = {elevator}
                />
            </div>
        </div>
    );
}

export default Project;