import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { Filter } from 'lucide-react';
import { api } from '../repository/api';
import '../styles/pages_css/Listings.css';

const Listings = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialCategory = queryParams.get('category') || '';

    // State for API data
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState({
        category: initialCategory,
        location: '',
        type: '',
        minPrice: '',
        maxPrice: ''
    });

    useEffect(() => {
        setFilters(prev => ({ ...prev, category: initialCategory }));
    }, [initialCategory]);

    // Fetch data from Backend
    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            try {
                let data = [];
                // If a specific category is selected in filters, fetch only that
                // Otherwise fetch everything
                if (filters.category && filters.category !== '') {
                    data = await api.getItemsByCategory(filters.category);
                } else {
                    data = await api.getAllItems();
                }
                setProperties(data);
            } catch (error) {
                console.error("Failed to fetch listings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchListings();
    }, [filters.category]); // Re-fetch when category filter changes

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Client-side filtering for Location, Type, and Price
    // (Since the backend endpoints currently only filter by type or category)
    const filteredProperties = properties.filter(property => {
        // Location Filter (Case insensitive check)
        // Some items (like Furniture) might not have 'location' in your model, check if it exists
        const matchLocation = filters.location === '' || 
            (property.location && property.location.toLowerCase().includes(filters.location.toLowerCase()));

        // Type Filter
        const matchType = filters.type === '' || property.type === filters.type;

        // Price Filter
        // Convert string price from DB to number
        const price = Number(property.price);
        const matchMinPrice = filters.minPrice === '' || price >= Number(filters.minPrice);
        const matchMaxPrice = filters.maxPrice === '' || price <= Number(filters.maxPrice);

        return matchLocation && matchType && matchMinPrice && matchMaxPrice;
    });

    return (
        <div className="page-container listings-page">
            <aside className="filters-sidebar">
                <div className="filters-header">
                    <Filter size={20} />
                    <h2>Filters</h2>
                </div>

                <div className="filter-group">
                    <label>Category</label>
                    <select name="category" value={filters.category} onChange={handleFilterChange}>
                        <option value="">All Categories</option>
                        <option value="real-estate">Real Estate</option>
                        <option value="vehicle">Vehicle</option>
                        <option value="furniture">Furniture</option>
                        <option value="appliances">Appliances</option>
                        <option value="electronics">Electronics</option>
                        <option value="package">Package</option>
                        <option value="baby-kids">Baby & Kids</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Location</label>
                    <select name="location" value={filters.location} onChange={handleFilterChange}>
                        <option value="">All Locations</option>
                        <option value="Downtown">Downtown</option>
                        <option value="Suburbs">Suburbs</option>
                        <option value="Uptown">Uptown</option>
                        <option value="Seaside">Seaside</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Type</label>
                    <select name="type" value={filters.type} onChange={handleFilterChange}>
                        <option value="">All Types</option>
                        {/* You can populate this dynamically later */}
                        <option value="apartment">Apartment</option>
                        <option value="house">House</option>
                        <option value="loft">Loft</option>
                        <option value="sedan">Sedan</option>
                        <option value="suv">SUV</option>
                        <option value="sofa">Sofa</option>
                        <option value="washing-machine">Washing Machine</option>
                        <option value="smartphone">Smartphone</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>Price Range</label>
                    <div className="price-inputs">
                        <input
                            type="number"
                            name="minPrice"
                            placeholder="Min"
                            value={filters.minPrice}
                            onChange={handleFilterChange}
                        />
                        <span>-</span>
                        <input
                            type="number"
                            name="maxPrice"
                            placeholder="Max"
                            value={filters.maxPrice}
                            onChange={handleFilterChange}
                        />
                    </div>
                </div>
            </aside>

            <main className="listings-content">
                <div className="listings-header">
                    <h1>{filters.category ? filters.category.charAt(0).toUpperCase() + filters.category.slice(1) : 'All'} Listings</h1>
                    <p>
                        {loading ? 'Searching...' : `${filteredProperties.length} results found`}
                    </p>
                </div>

                {loading ? (
                     <div className="text-center" style={{ padding: '2rem' }}>
                        <h3>Loading listings from database...</h3>
                     </div>
                ) : filteredProperties.length > 0 ? (
                    <div className="properties-grid">
                        {filteredProperties.map(property => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                ) : (
                    <div className="no-results">
                        <h3>No items found matching your criteria.</h3>
                        <button
                            className="btn btn-outline"
                            onClick={() => setFilters({ category: '', location: '', type: '', minPrice: '', maxPrice: '' })}
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Listings;