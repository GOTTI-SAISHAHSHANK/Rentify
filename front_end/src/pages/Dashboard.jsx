// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../repository/api';
import PropertyCard from '../components/PropertyCard';
import ErrorDialogue from '../common/ErrorDialogue';
import '../styles/pages_css/Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('listings');
    
    const [userListings, setUserListings] = useState([]);
    const [isLoadingListings, setIsLoadingListings] = useState(true);
    
    // State for Error Dialogue
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
        } else {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            fetchUserListings(parsedUser);
        }
    }, [navigate]);

    const fetchUserListings = async (currentUser) => {
        setIsLoadingListings(true);
        try {
            const userId = String(currentUser.id || currentUser._id);
            const listings = await api.getItemsByUserId(userId);
            setUserListings(listings);
        } catch (error) {
            console.error("Failed to fetch user listings:", error);
            setErrorMsg("Failed to load your listings.");
        } finally {
            setIsLoadingListings(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('storage'));
        navigate('/');
    };

    const toggleStatus = async (property) => {
        const newStatus = property.status === 'available' ? 'rented' : 'available';
        try {
            await api.updateItemStatus(property.id, property.category, newStatus);
            // Update UI instantly
            setUserListings(prev => 
                prev.map(p => p.id === property.id ? { ...p, status: newStatus } : p)
            );
        } catch (error) {
            setErrorMsg("Failed to update status.");
            console.error(error);
        }
    };

    if (!user) return <div>Loading...</div>;

    // Split the listings into two groups based on status
    const availableListings = userListings.filter(item => item.status !== 'rented');
    const rentedListings = userListings.filter(item => item.status === 'rented');

    return (
        <div className="dashboard-container">
            {/* Inject Error Dialogue */}
            <ErrorDialogue open={!!errorMsg} message={errorMsg} onClose={() => setErrorMsg('')} />

            <aside className="dashboard-sidebar">
                <div className="sidebar-brand">
                    <h2>Rentify</h2>
                </div>
                
                <nav className="sidebar-nav">
                    <Link to="/" className="nav-item">
                        <span className="icon">🏠</span> Home
                    </Link>
                    <button 
                        className={`nav-item ${activeTab === 'listings' ? 'active' : ''}`}
                        onClick={() => setActiveTab('listings')}
                    >
                        <span className="icon">📦</span> My Listings
                    </button>
                    <button 
                        className={`nav-item ${activeTab === 'rentals' ? 'active' : ''}`}
                        onClick={() => setActiveTab('rentals')}
                    >
                        <span className="icon">🔑</span> My Rentals
                    </button>
                </nav>

                <div className="sidebar-footer">
                    <button className="logout-btn" onClick={handleLogout}>
                        <span className="icon">🚪</span> Logout
                    </button>
                </div>
            </aside>

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <h1>Good afternoon, {user.firstName}!</h1>
                </header>

                <div className="dashboard-content">
                    {/* MY LISTINGS TAB (Available Items Only) */}
                    {activeTab === 'listings' && (
                        <div className="tab-section">
                            <div className="section-header-flex">
                                <h2>Items You Are Renting Out</h2>
                                <Link to="/add-property" className="btn btn-primary">+ Add New Item</Link>
                            </div>
                            
                            {isLoadingListings ? (
                                <p>Loading your listings...</p>
                            ) : availableListings.length > 0 ? (
                                <div className="properties-grid" style={{ marginTop: '1.5rem' }}>
                                    {availableListings.map(property => (
                                        <div key={property.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <PropertyCard property={property} />
                                            <button 
                                                onClick={() => toggleStatus(property)}
                                                className="btn btn-primary"
                                                style={{ width: '100%' }}
                                            >
                                                Mark as Rented
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state-card">
                                    <p>You don't have any available items listed right now.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* MY RENTALS TAB (Rented Items Only) */}
                    {activeTab === 'rentals' && (
                        <div className="tab-section">
                            <h2>Items Currently Rented Out</h2>
                            
                            {isLoadingListings ? (
                                <p>Loading your rentals...</p>
                            ) : rentedListings.length > 0 ? (
                                <div className="properties-grid" style={{ marginTop: '1.5rem' }}>
                                    {rentedListings.map(property => (
                                        <div key={property.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <PropertyCard property={property} />
                                            <button 
                                                onClick={() => toggleStatus(property)}
                                                className="btn btn-outline"
                                                style={{ width: '100%' }}
                                            >
                                                Mark as Available
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state-card">
                                    <p>You have no active rentals.</p>
                                    <button onClick={() => setActiveTab('listings')} className="btn btn-secondary mt-2">
                                        View My Listings
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;