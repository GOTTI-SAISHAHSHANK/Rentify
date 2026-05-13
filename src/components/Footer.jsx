import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for faster navigation
import '../styles/component_css/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h3>Rentify</h3>
                        <p>Find your perfect rental home today.</p>
                    </div>
                    <div className="footer-links">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/listings">Listings</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/contact">Contact</Link></li>
                        </ul>
                    </div>
                    <div className="footer-social">
                        <h4>Follow Us</h4>
                        {/* Added Coming Soon text as requested */}
                        <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                            Coming Soon...
                        </p>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Rentify. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;