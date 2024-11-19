import React from 'react';
import './Navbar.css';
import { FaSearch, FaBell, FaUserCircle } from 'react-icons/fa';

const NavBar = () => (
    <nav className="navbar">
        {/* Logo */}
        <img src="/logo.png" alt="Logo" className="navbar-logo" />

        {/* Widgets Section */}
        <div className="navbar-widgets">
            {/* Navigation Links */}
            <ul className="navbar-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>

            {/* Search Bar */}
            <div className="navbar-search">
                <FaSearch className="navbar-icon" />
                <input type="text" placeholder="Search" />
            </div>

            {/* Notifications */}
            <FaBell className="navbar-icon" />

            {/* Profile Icon */}
            <FaUserCircle className="navbar-icon" />
        </div>
    </nav>
);

export default NavBar;
