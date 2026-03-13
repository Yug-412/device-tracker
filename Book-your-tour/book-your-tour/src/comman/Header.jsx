import React from 'react'
import "./Header.css";

function header() {
  return (
   <header className="header">
      <div className="container">
        {/* Logo & Brand */}
        <div className="logo">
          <img
            src="./img/logo.png"
            alt="Book Your Tour Logo"
            className="logo-img"
          />
          <h1>Book Your Tour</h1>
        </div>

        {/* Navigation */}
        <nav className="nav">
          <ul>
            <li><a href="#4seater">4 Seater</a></li>
            <li><a href="#7seater">7 Seater</a></li>
            <li><a href="#16seater">16 Seater</a></li>
            <li><a href="#50seater">50 Seater</a></li>
          </ul>
        </nav>

        {/* Contact Button */}
        <div className="contact-btn">
          <a href="#contact">Contact Us</a>
        </div>
      </div>
    </header>
  )
}

export default header