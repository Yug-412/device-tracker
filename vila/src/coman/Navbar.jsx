import React from 'react'
import { NavLink } from 'react-router-dom'

function Navbar() {
    return (
        <div>
            <div>
             
              
                {/* ***** Header Area Start ***** */}
                <header className="header-area header-sticky">
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <nav className="main-nav">
                                    {/* ***** Logo Start ***** */}
                                    <a href="#" className="logo">
                                        <h1>Villa</h1>
                                    </a>
                                    {/* ***** Logo End ***** */}
                                    {/* ***** Menu Start ***** */}
                                    <ul className="nav">
                                        <li><NavLink to="/">Home</NavLink></li>
                                        <li><NavLink to="/properties">Properties</NavLink></li>
                                        <li><NavLink to="/propertiesdetail" >Property Details</NavLink></li>
                                        <li><NavLink to="/contact">Contact Us</NavLink></li>
                                        <li><a href="#"><i className="fa fa-calendar" /> Schedule a visit</a></li>
                                    </ul>
                                    <a className="menu-trigger">
                                        <span>Menu</span>
                                    </a>
                                    {/* ***** Menu End ***** */}
                                </nav>
                            </div>
                        </div>
                    </div>
                </header>
                {/* ***** Header Area End ***** */}
            </div>

        </div>
    )
}

export default Navbar
