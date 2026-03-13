import React from 'react';
import { NavLink } from 'react-router-dom';
import './Anav.css'; // Custom styles here

function Anav() {
    return (
        <header className="admin-header">
            <div className="admin-container">
                <div className="logo">
                    <h1>Villa</h1>
                </div>
                <nav className="admin-nav">
                    <NavLink
                        to="/admin"
                        className={({ isActive }) =>
                            isActive ? "nav-item active" : "nav-item"
                        }
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/user"
                        className={({ isActive }) =>
                            isActive ? "nav-item active" : "nav-item"
                        }
                    >
                        Inquiry
                    </NavLink>
                     <NavLink
                        to="/details"
                        className={({ isActive }) =>
                            isActive ? "nav-item active" : "nav-item"
                        }
                    >
                        product-details
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}

export default Anav;
