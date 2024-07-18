import React from 'react'
import './Static/Contact.css'

const Contact = () => {
  return (
    <div id='contact'>
        <div className="left-container">
            <div className="get-in-touch">Get In Touch</div>
            <div className="email"><strong>Email:</strong> adesh.yearanty@gmail.com</div>
        </div>
        <div className="right-container">
            <p><a href="https://github.com/adeshyearanty">GitHub</a></p>
            <p><a href="https://www.linkedin.com/in/adesh-yearanty-271718212/">LinkedIn</a></p>
            <p><a href="https://www.facebook.com/adesh.yearanty/">FaceBook</a></p>
        </div>
    </div>
  )
}

export default Contact