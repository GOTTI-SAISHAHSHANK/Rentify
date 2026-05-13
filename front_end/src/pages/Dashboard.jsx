// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../repository/api';
import PropertyCard from '../components/PropertyCard';
import ErrorDialogue from '../common/ErrorDialogue';
import SuccessDialogue from '../common/SuccessDialogue';
import '../styles/pages_css/Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('listings');
    
    const [userListings, setUserListings] = useState([]);
    const [isLoadingListings, setIsLoadingListings] = useState(true);
    
    // State for Dialogues and Confirmation
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [itemToDelete, setItemToDelete] = useState(null); // Track the item pending deletion

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
            setUserListings(prev => 
                prev.map(p => p.id === property.id ? { ...p, status: newStatus } : p)
            );
            setSuccessMsg(`Status updated to ${newStatus === 'rented' ? 'Rented' : 'Available'} successfully!`);
        } catch (error) {
            setErrorMsg("Failed to update status.");
            console.error(error);
        }
    };

    // This triggers the custom confirmation modal
    const initiateDelete = (property) => {
        setItemToDelete(property);
    };

    // This executes when the user clicks "OK" inside the custom modal
    const executeDelete = async () => {
        if (!itemToDelete) return;
        
        const property = itemToDelete;
        
        try {
            const userId = String(user.id || user._id);
            console.log("Sending delete request for User ID:", userId);
            
            // Call the API
            await api.deleteItem(property.id, property.category, userId);
            
            // Remove the item from the UI instantly
            setUserListings(prev => prev.filter(p => p.id !== property.id));
            
            // Show the success dialogue
            setSuccessMsg(`"${property.title}" was deleted successfully.`);
        } catch (error) {
            console.error("❌ Failed to delete property. Full error:", error);
            const backendError = error.response?.data?.detail || "Failed to delete the item. Please try again.";
            setErrorMsg(backendError);
        } finally {
            // Close the confirmation modal whether it succeeds or fails
            setItemToDelete(null);
        }
    };

    if (!user) return <div>Loading...</div>;

    const availableListings = userListings.filter(item => item.status !== 'rented');
    const rentedListings = userListings.filter(item => item.status === 'rented');

    const deleteBtnStyle = {
        backgroundColor: '#ff4d4f', 
        color: 'white', 
        border: 'none', 
        borderRadius: '4px', 
        padding: '0 15px', 
        cursor: 'pointer',
        fontSize: '1.2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    return (
        <div className="dashboard-container">
            {/* Native Dialogues */}
            <ErrorDialogue open={!!errorMsg} message={errorMsg} onClose={() => setErrorMsg('')} />
            <SuccessDialogue open={!!successMsg} message={successMsg} onClose={() => setSuccessMsg('')} />

            {/* Custom Confirmation Modal for Delete */}
            {itemToDelete && (
                <div className="modal-confirm-overlay" onClick={() => setItemToDelete(null)}>
                    <div className="modal-confirm-box" onClick={(e) => e.stopPropagation()}>
                        <h3 style={{ marginTop: 0, color: '#c62828' }}>Confirm Deletion</h3>
                        <p>Are you sure you want to delete "{itemToDelete.title}"? This action cannot be undone.</p>
                        <div className="modal-confirm-actions" style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
                            <button className="btn-cancel" onClick={() => setItemToDelete(null)}>
                                Cancel
                            </button>
                            <button 
                                className="btn btn-primary" 
                                style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }} 
                                onClick={executeDelete}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

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
                    {/* MY LISTINGS TAB */}
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
                                            
                                            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                                                <button 
                                                    onClick={() => toggleStatus(property)}
                                                    className="btn btn-primary"
                                                    style={{ flex: 1 }}
                                                >
                                                    Mark as Rented
                                                </button>
                                                <button 
                                                    onClick={() => initiateDelete(property)}
                                                    style={deleteBtnStyle}
                                                    title="Delete Item"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
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

                    {/* MY RENTALS TAB */}
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
                                            
                                            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                                                <button 
                                                    onClick={() => toggleStatus(property)}
                                                    className="btn btn-outline"
                                                    style={{ flex: 1 }}
                                                >
                                                    Mark as Available
                                                </button>
                                                <button 
                                                    onClick={() => initiateDelete(property)}
                                                    style={deleteBtnStyle}
                                                    title="Delete Item"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
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