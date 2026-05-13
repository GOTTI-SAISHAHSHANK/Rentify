import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/rentify-logo.jpeg';
import '../styles/component_css/Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        const handleStorageChange = () => {
            const updatedUser = localStorage.getItem('user');
            setUser(updatedUser ? JSON.parse(updatedUser) : null);
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Re-added logout logic here for the Navbar
    const handleLogout = () => {
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('storage'));
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <img src={logo} alt="Rentify Logo" className="logo-img" />
                    <span>Rentify</span>
                </Link>
                
                <div className="nav-auth">
                    {user ? (
                        // New wrapper for multiple user actions
                        <div className="user-nav-actions">
                            <Link to="/dashboard" className="profile-icon-link" title="Go to Dashboard">
                                <div className="profile-avatar">
                                    {user.firstName ? user.firstName.charAt(0).toUpperCase() : '👤'}
                                </div>
                            </Link>
                            
                            {/* New Logout Icon Button */}
                            <button onClick={handleLogout} className="navbar-logout-btn" title="Logout">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16 17 21 12 16 7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-outline">Login</Link>
                            <Link to="/register" className="btn btn-primary">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;