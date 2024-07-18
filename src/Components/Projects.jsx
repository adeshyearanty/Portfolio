import React from 'react'
import './Static/Projects.css'
import ProjectsCard from './ProjectsCard'
import bookStore from './Assets/bookStore.png'
import elevator from './Assets/elevator.jpg'
import weather from './Assets/weather.png'

const Projects = () => {
  return (
    <div className='project-list'>
        <ProjectsCard 
            id = "weather-card"
            title = "Weather Application"
            imgSrc = {weather}   
            description = "Developed a weather application by React.js framework. The app prompts the user for the location and the weather report of that particular location entered by the user will be displayed."
            gitRepo = "https://github.com/adeshyearanty/Weather-Application"
        />
        <ProjectsCard 
            id = "book-store-card"
            title = "Book Store Application"
            imgSrc = {bookStore}   
            description = "Developed a book store application by MERN stack, where it stores the books and CRUD operations can be performed on the list of books."
            gitRepo = "https://github.com/adeshyearanty/book-store-MERN"
        />
        <ProjectsCard 
            id = "elevator-card"
            title = "Elevator Applications"
            imgSrc = {elevator}   
            description = "Programmed to implement basic operations of elevator like moving up and down from one floor to another in an elevator from the inputs given by the user in C++ language using the Data Structures."
        />
    </div>
  )
}

export default Projects