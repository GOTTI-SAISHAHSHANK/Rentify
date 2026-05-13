import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { MapPin, Bed, Bath, Square, ArrowLeft, Phone, Mail, User, CheckCircle, Info, FileText, UserCircle } from 'lucide-react';
import { api } from '../repository/api';
import SuccessDialogue from '../common/SuccessDialogue';
import '../styles/pages_css/PropertyDetails.css';

const PropertyDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(true);
    
    const [contactInfo, setContactInfo] = useState('');

    // --- HIDE FOOTER ON THIS PAGE ---
    useEffect(() => {
        const footerElement = document.querySelector('footer');
        if (footerElement) {
            footerElement.style.display = 'none'; // Hide when component mounts
        }
        return () => {
            if (footerElement) {
                footerElement.style.display = ''; // Restore when component unmounts
            }
        };
    }, []);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            setIsAuthenticated(false);
            setLoading(false);
            return;
        }

        const fetchDetails = async () => {
            setLoading(true);
            try {
                const categoryHint = location.state?.category;
                const data = await api.getItemById(id, categoryHint);
                
                if (data) {
                    setProperty(data);
                } else {
                    setError("Item not found");
                }
            } catch (err) { 
                setError("Could not load item details."); 
            } finally { 
                setLoading(false); 
            }
        };
        
        fetchDetails();
    }, [id, location.state]);

    if (!isAuthenticated) {
        return (
            <div className="resume-container unauth-container text-center">
                <h2>Authentication Required</h2>
                <p>You must be signed in to view the full details and contact the owner.</p>
                <div className="auth-actions">
                    <Link to="/login" className="btn btn-primary">Log In</Link>
                    <Link to="/register" className="btn btn-outline">Register</Link>
                </div>
                <Link to="/" className="back-link center-link">
                    <ArrowLeft size={20} /> Back to Listings
                </Link>
            </div>
        );
    }

    if (loading) {
        return <div className="resume-container text-center"><h2>Loading Document...</h2></div>;
    }
    
    if (error || !property) {
        return (
            <div className="resume-container text-center">
                <h2>{error}</h2>
                <Link to="/" className="btn btn-primary mt-2">Back to Home</Link>
            </div>
        );
    }

    const isRealEstate = !property.category || property.category === 'real-estate';
    const isRented = property.status === 'rented';

    return (
        <div className="property-resume-page">
            <SuccessDialogue 
                open={!!contactInfo} 
                title="Owner Contact Info" 
                message={contactInfo} 
                onClose={() => setContactInfo('')} 
            />

            <div className="resume-document">
                <div className="resume-nav">
                    <Link to="/" className="back-link">
                        <ArrowLeft size={18} /> Return to Listings
                    </Link>
                    <div className={`resume-badge ${isRented ? 'rented' : 'available'}`}>
                        {property.status ? property.status.toUpperCase() : 'AVAILABLE'}
                    </div>
                </div>

                {/* Cover Image */}
                <div className="resume-cover">
                    <img 
                        src={property.image_url || property.image || "https://via.placeholder.com/1200x400"} 
                        alt={property.title} 
                    />
                    <div className="resume-price-overlay">
                        ₹{Number(property.price || 0).toLocaleString()} <span>/ mo</span>
                    </div>
                </div>

                <div className="resume-body">
                    {/* Header Section */}
                    <header className="resume-header">
                        <h1>{property.title}</h1>
                        <div className="resume-meta">
                            <span className="meta-item"><MapPin size={18} /> {property.location || "Location N/A"}</span>
                            <span className="meta-item tag">{property.type || property.category || "Listing"}</span>
                        </div>
                    </header>

                    {/* Specifications Section */}
                    <section className="resume-section">
                        <div className="section-title">
                            <Info size={24} />
                            <h2>Specifications</h2>
                        </div>
                        
                        <div className="specs-container">
                            {isRealEstate ? (
                                <>
                                    <div className="spec-box"><Bed size={24} /><strong>{property.bedrooms || 0}</strong><span>Bedrooms</span></div>
                                    <div className="spec-box"><Bath size={24} /><strong>{property.bathrooms || 0}</strong><span>Bathrooms</span></div>
                                    <div className="spec-box"><Square size={24} /><strong>{property.area || 0}</strong><span>Sq. Ft.</span></div>
                                </>
                            ) : (
                                <>
                                    {property.brand && <div className="spec-box"><strong>Brand</strong><span>{property.brand}</span></div>}
                                    {property.condition && <div className="spec-box"><strong>Condition</strong><span>{property.condition}</span></div>}
                                </>
                            )}
                        </div>
                    </section>

                    {/* Description Section */}
                    <section className="resume-section">
                        <div className="section-title">
                            <FileText size={24} />
                            <h2>Description</h2>
                        </div>
                        <div className="resume-text-content">
                            <p>{property.description || "No detailed description provided by the owner."}</p>
                        </div>
                    </section>

                    {/* Amenities Section */}
                    {property.amenities?.length > 0 && (
                        <section className="resume-section">
                            <div className="section-title">
                                <CheckCircle size={24} />
                                <h2>Features & Amenities</h2>
                            </div>
                            <ul className="resume-list">
                                {property.amenities.map((a, i) => (
                                    <li key={i}>{a}</li>
                                ))}
                            </ul>
                        </section>
                    )}

                    {/* Contact/Signature Section */}
                    <section className="resume-section contact-section">
                        <div className="section-title">
                            <UserCircle size={24} />
                            <h2>Owner Contact Details</h2>
                        </div>
                        
                        <div className="contact-block">
                            <div className="owner-profile">
                                <div className="owner-avatar-lg">
                                    {property.owner_name ? property.owner_name.charAt(0).toUpperCase() : <User size={32} />}
                                </div>
                                <div className="owner-details">
                                    <h3>{property.owner_name || "Verified Owner"}</h3>
                                    <p>Registered Proprietor</p>
                                </div>
                            </div>

                            <div className="contact-buttons">
                                <button className="btn btn-primary" onClick={() => setContactInfo(`Call: ${property.owner_phone || 'N/A'}`)}>
                                    <Phone size={18} /> Request Phone
                                </button>
                                <button className="btn btn-secondary" onClick={() => setContactInfo(`Email: ${property.owner_email || 'N/A'}`)}>
                                    <Mail size={18} /> Request Email
                                </button>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;