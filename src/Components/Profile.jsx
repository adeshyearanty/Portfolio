import React from "react";
import "./Static/Profile.css"
import profile from './Assets/Profile.png'
import Card from './Card.jsx'
import data from './Assets/information.json'

function Profile() {
    return (
        <div className="profile" id="profile">
            <div className="image">
                <img src={profile} alt="no image" className="pic" />
            </div>
            <div className="info">
                <div className="experience">
                    <div className="title">Internships</div>
                    {data.internships.map(internship => (
                        <Card 
                            duration = {internship.duration}
                            company = {internship.company}
                            comp_desc = {internship.comp_desc}
                            role = {internship.role}
                            description = {internship.description}
                        />
                    ))}
                </div>
                <div className="education">
                    <div className="title">Education</div>
                    {data.education.map(edu => (
                        <Card
                            duration = {edu.duration}
                            company = {edu.company}
                            comp_desc = ""
                            role = {edu.role}
                            description = {edu.description}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Profile;