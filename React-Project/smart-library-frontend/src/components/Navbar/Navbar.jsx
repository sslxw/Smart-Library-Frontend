import React from 'react';
import './Navbar.css';
import logo from '../../assets/icon.png';

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="logo-title">
                <img src={logo} alt="Icon" />
                <span>Smart Library</span>
            </div>
            <div>
                <a href="#">Home</a>
                <a href="#">Gallery</a>
                <a href="#">Contact</a>
            </div>
        </div>
    );
};

export default Navbar;
