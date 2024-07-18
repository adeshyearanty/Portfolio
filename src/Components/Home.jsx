import React from "react";
import linkedin from "./Assets/linkedin.png"
import github from "./Assets/github.png"
import "./Static/Home.css"

function Home() {
    return (
        <div className="gradient-background">
            <div className="content">
                <div id="blank">
                    <p>Portfolio</p>
                    <a href="#profile" className="navBarElements">About Me</a>
                    <a href="#projects" className="navBarElements">Projects</a>
                    <a href="#contact" className="navBarElements">Contact Me</a>
                </div>
                <div id="description">
                    Hello!👋 I am Adesh Yearanty, a Web Developer based in India.
                </div>
                <div id="contacts">
                    <div className="handles">
                        <img src={linkedin} id="linkedin"/>
                        <span><a id="handles" href="https://github.com/adeshyearanty">@adeshyearanty</a></span>
                    </div>
                    <div className="handles">
                        <img src={github} id="github"/>
                        <span><a id="handles" href="https://www.linkedin.com/in/adesh-yearanty-271718212/">@adeshyearanty</a></span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home