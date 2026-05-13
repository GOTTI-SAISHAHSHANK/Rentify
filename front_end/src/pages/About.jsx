import React from 'react';
import '../styles/pages_css/Home.css'; // Re-using Home styles for consistency

const About = () => {
    return (
        <div className="page-container" style={{ padding: '4rem 1rem', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>About Rentify</h1>
            
            <section style={{ marginBottom: '2rem' }}>
                <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                    Rentify is your one-stop destination for all rental needs. Whether you are looking for a 
                    cozy apartment, a reliable vehicle for your weekend trip, or furniture to set up your 
                    new home, we have got you covered.
                </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Our Mission</h2>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                    We aim to simplify the rental process by connecting trustworthy owners with 
                    verified tenants. We believe renting should be easy, transparent, and secure 
                    for everyone involved.
                </p>
            </section>

            <section>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Why Choose Us?</h2>
                <ul style={{ listStyle: 'disc', paddingLeft: '20px', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                    <li>Verified Listings</li>
                    <li>Secure Transactions</li>
                    <li>Wide Range of Categories (Real Estate, Vehicles, Electronics, etc.)</li>
                    <li>24/7 Customer Support</li>
                </ul>
            </section>
        </div>
    );
};

export default About;