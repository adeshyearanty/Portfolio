import React from 'react';
import Home from './Home';
import Profile from './Profile';
import Projects from './Projects';
import Project from './Project';
import Contact from './Contact';

function Portfolio() {
    return (
        <div>
            <Home />
            <Profile />
            <Project />
            <Projects /> 
            <Contact />
        </div>
    );
}

export default Portfolio;