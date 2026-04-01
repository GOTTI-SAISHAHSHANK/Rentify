import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { api } from '../repository/api';
import '../styles/pages_css/Home.css';

const Home = () => {
    const [featuredProperties, setFeaturedProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Fetch properties
        const fetchFeaturedProperties = async () => {
            try {
                const allItems = await api.getAllItems();
                setFeaturedProperties(allItems.slice(0, 3));
            } catch (error) {
                console.error("Error fetching featured properties:", error);
            } finally {
                setLoading(false);
            }
        };

        // Check for logged-in user
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        fetchFeaturedProperties();
    }, []);

    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Find Your Perfect Rental</h1>
                    <p className="hero-subtitle">Discover thousands of Homes, Appliances, Electronics and more for rent.</p>
                    <div className="hero-actions">
                        <Link to="/listings" className="btn btn-primary btn-lg">Browse Listings</Link>
                    </div>
                </div>
            </section>

            {/* Changed from page-container to section-container */}
            <section className="featured-section section-container">
                <div className="section-header">
                    <h2>Featured Properties</h2>
                    <Link to="/listings" className="view-all-link">View All &rarr;</Link>
                </div>

                {loading ? (
                    <div className="text-center" style={{ padding: '2rem' }}>
                        <p>Loading featured items...</p>
                    </div>
                ) : featuredProperties.length > 0 ? (
                    <div className="properties-grid">
                        {featuredProperties.map(property => (
                            <PropertyCard key={property.id || property._id} property={property} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center" style={{ padding: '3rem 1rem' }}>
                        <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
                            No listings available at the moment.
                        </p>
                        
                        {user ? (
                            <Link 
                                to="/add-property" 
                                className="btn btn-primary" 
                                style={{ 
                                    display: 'inline-block', 
                                    width: 'auto',
                                    padding: '0.8rem 2rem'
                                }}
                            >
                                Be the first to list!
                            </Link>
                        ) : (
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)' }}>
                                Check back later for new updates!
                            </p>
                        )}
                    </div>
                )}
            </section>

            {/* Removed page-container completely so the white background wraps tightly */}
            <section className="categories-section">
                <h2 className="section-title text-center">Rent Any Product!</h2>
                <div className="categories-grid">
                    <Link to="/listings?category=package" className="category-card">
                        <div className="category-icon">📦</div>
                        <span>Package</span>
                    </Link>
                    <Link to="/listings?category=furniture" className="category-card">
                        <div className="category-icon">🛋️</div>
                        <span>Furniture</span>
                    </Link>
                    <Link to="/listings?category=appliances" className="category-card">
                        <div className="category-icon">🧺</div>
                        <span>Appliances</span>
                    </Link>
                    <Link to="/listings?category=electronics" className="category-card">
                        <div className="category-icon">📱</div>
                        <span>Electronics</span>
                    </Link>
                    <Link to="/listings?category=baby-kids" className="category-card">
                        <div className="category-icon">👶</div>
                        <span>Baby & Kids</span>
                    </Link>
                    <Link to="/listings?category=vehicle" className="category-card">
                        <div className="category-icon">🚗</div>
                        <span>Vehicle</span>
                    </Link>
                </div>
            </section>

            <section className="how-it-works-section">
                {/* Changed from page-container to section-container */}
                <div className="section-container">
                    <h2 className="section-title text-center">How It Works</h2>
                    <div className="steps-grid">
                        <div className="step-card">
                            <div className="step-number">1</div>
                            <h3>Search</h3>
                            <p>Browse through our extensive list of properties to find your match.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">2</div>
                            <h3>Contact</h3>
                            <p>Connect directly with property owners or agents.</p>
                        </div>
                        <div className="step-card">
                            <div className="step-number">3</div>
                            <h3>Move In</h3>
                            <p>Seal the deal and rent the product!</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;