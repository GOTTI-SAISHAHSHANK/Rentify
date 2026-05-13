import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Square } from 'lucide-react';
import '../styles/component_css/PropertyCard.css';

const PropertyCard = ({ property }) => {
    const propertyId = property.id || property._id;

    if (!property) return null;

    // Determine status styling
    const isRented = property.status === 'rented';
    const badgeStyle = {
        marginLeft: '8px',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '0.75rem',
        backgroundColor: isRented ? '#ffebee' : '#e8f5e9',
        color: isRented ? '#c62828' : '#2e7d32',
        fontWeight: 'bold',
        verticalAlign: 'middle',
        display: 'inline-block'
    };

    return (
        <div className="property-card">
            <div className="property-image-container">
                <img 
                    src={property.image_url || property.image || "https://via.placeholder.com/300"} 
                    alt={property.title} 
                    className="property-image" 
                />
            </div>
            
            <div className="property-content">
                <div className="property-meta">
                    <span className="property-type" style={{ display: 'flex', alignItems: 'center' }}>
                        {property.type || "Listing"}
                        {/* NEW: Status Badge inside the card */}
                        <span style={badgeStyle}>
                            {property.status ? property.status.toUpperCase() : 'AVAILABLE'}
                        </span>
                    </span>
                    <span className="property-price">₹{Number(property.price || 0).toLocaleString()}/mo</span>
                </div>

                <h3 className="property-title">
                    <Link to={`/listings/${propertyId}`} state={{ category: property.category }}>
                        {property.title}
                    </Link>
                </h3>
                
                <div className="property-location">
                    <MapPin size={16} />
                    <span>{property.location || "Location N/A"}</span>
                </div>

                {(!property.category || property.category === 'real-estate') ? (
                    <div className="property-features">
                        <div className="feature">
                            <Bed size={16} />
                            <span>{property.bedrooms || 0} Beds</span>
                        </div>
                        <div className="feature">
                            <Bath size={16} />
                            <span>{property.bathrooms || 0} Baths</span>
                        </div>
                        <div className="feature">
                            <Square size={16} />
                            <span>{property.area || 0} sqft</span>
                        </div>
                    </div>
                ) : (
                    <div className="property-features">
                        {property.brand && (
                            <div className="feature">
                                <span>Brand: {property.brand}</span>
                            </div>
                        )}
                        {property.condition && (
                            <div className="feature">
                                <span>Cond: {property.condition}</span>
                            </div>
                        )}
                    </div>
                )}
                
                <Link 
                    to={`/listings/${propertyId}`} 
                    state={{ category: property.category }}
                    className="btn btn-outline property-btn"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default PropertyCard;