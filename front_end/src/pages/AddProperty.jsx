// src/pages/AddProperty.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../repository/api';
import SuccessDialogue from '../common/SuccessDialogue';
import ErrorDialogue from '../common/ErrorDialogue';
import '../styles/pages_css/AddProperty.css';

const AddProperty = () => {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [user, setUser] = useState(null);

    // Dialogue States
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [navTarget, setNavTarget] = useState(''); // Where to go after dialog closes

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setErrorMsg("You must be logged in to list a property.");
            setNavTarget('/login');
        }
    }, []);

    const handleDialogClose = () => {
        setSuccessMsg('');
        setErrorMsg('');
        if (navTarget) navigate(navTarget);
    };

    const [formData, setFormData] = useState({
        category: 'real-estate', title: '', description: '', price: '', location: '', type: 'apartment',
        bedrooms: '', bathrooms: '', area: '', image_url: '', brand: '', condition: '',
        mileage: '', engine: '', length: '', breadth: '', height: '', ram: '', rom: ''
    });

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!user) {
            setErrorMsg("Session expired. Please login again.");
            setNavTarget('/login');
            setIsSubmitting(false);
            return;
        }

        try {
            const userId = String(user.id || user._id);
            const basePayload = {
                category: formData.category, user_id: userId, title: formData.title,
                price: formData.price, type: formData.type, location: formData.location,
                description: formData.description, image_url: formData.image_url || "N/A",
                owner_name: `${user.firstName} ${user.lastName}`, owner_email: user.email, owner_phone: user.phone || "N/A"
            };

            let specificPayload = {};
            // ... (keep all your existing switch statement logic here) ...
            switch (formData.category) {
                case 'real-estate': specificPayload = { bedrooms: formData.bedrooms ? Number(formData.bedrooms) : 0, bathrooms: formData.bathrooms ? Number(formData.bathrooms) : 0, area: formData.area ? Number(formData.area) : 0 }; break;
                case 'vehicle': specificPayload = { mileage: formData.mileage ? Number(formData.mileage) : 0, engine: formData.engine, condition: formData.condition }; break;
                case 'furniture': specificPayload = { length: formData.length ? Number(formData.length) : 0, breadth: formData.breadth ? Number(formData.breadth) : 0, height: formData.height ? Number(formData.height) : 0, condition: formData.condition }; break;
                case 'electronics': specificPayload = { brand: formData.brand, ram: formData.ram, rom: formData.rom, condition: formData.condition }; break;
                case 'appliances': case 'package': case 'baby-kids': specificPayload = { brand: formData.brand, condition: formData.condition }; break;
                default: break;
            }

            const finalPayload = { ...basePayload, ...specificPayload };
            await api.addItem(finalPayload);

            setSuccessMsg('Item listed successfully!');
            setNavTarget('/listings');

        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrorMsg('Validation Error: The data sent does not match the backend model.');
            } else {
                setErrorMsg('Failed to list item. Please check the console for errors.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderCategorySpecificFields = () => { /* ... Keep exactly as it is ... */ 
        switch (formData.category) {
            case 'real-estate': return (<div className="form-row three-cols"><div className="form-group"><label>Bedrooms</label><input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange} required /></div><div className="form-group"><label>Bathrooms</label><input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange} required /></div><div className="form-group"><label>Area (sqft)</label><input type="number" name="area" value={formData.area} onChange={handleChange} required /></div></div>);
            case 'vehicle': return (<div className="form-row three-cols"><div className="form-group"><label>Mileage</label><input type="number" name="mileage" value={formData.mileage} onChange={handleChange} required /></div><div className="form-group"><label>Engine</label><input type="text" name="engine" value={formData.engine} onChange={handleChange} required /></div><div className="form-group"><label>Condition</label><select name="condition" value={formData.condition} onChange={handleChange} required><option value="">Select Condition</option><option value="New">New</option><option value="Used">Used</option><option value="Certified Pre-Owned">Certified Pre-Owned</option></select></div></div>);
            case 'furniture': return (<><div className="form-row three-cols"><div className="form-group"><label>Length (cm)</label><input type="number" name="length" value={formData.length} onChange={handleChange} required /></div><div className="form-group"><label>Breadth (cm)</label><input type="number" name="breadth" value={formData.breadth} onChange={handleChange} required /></div><div className="form-group"><label>Height (cm)</label><input type="number" name="height" value={formData.height} onChange={handleChange} required /></div></div><div className="form-row"><div className="form-group"><label>Condition</label><select name="condition" value={formData.condition} onChange={handleChange} required><option value="">Select Condition</option><option value="New">New</option><option value="Like New">Like New</option><option value="Good">Good</option><option value="Fair">Fair</option></select></div></div></>);
            case 'electronics': return (<div className="form-row three-cols"><div className="form-group"><label>Brand</label><input type="text" name="brand" value={formData.brand} onChange={handleChange} required /></div><div className="form-group"><label>RAM</label><input type="text" name="ram" value={formData.ram} onChange={handleChange} placeholder="e.g. 8GB" /></div><div className="form-group"><label>ROM/Storage</label><input type="text" name="rom" value={formData.rom} onChange={handleChange} placeholder="e.g. 256GB" /></div><div className="form-group"><label>Condition</label><select name="condition" value={formData.condition} onChange={handleChange}><option value="">Select Condition</option><option value="New">New</option><option value="Like New">Like New</option><option value="Good">Good</option></select></div></div>);
            case 'appliances': case 'package': case 'baby-kids': return (<div className="form-row"><div className="form-group"><label>Brand</label><input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. Samsung, IKEA" /></div><div className="form-group"><label>Condition</label><select name="condition" value={formData.condition} onChange={handleChange}><option value="">Select Condition</option><option value="New">New</option><option value="Like New">Like New</option><option value="Good">Good</option><option value="Fair">Fair</option></select></div></div>);
            default: return null;
        }
    };

    return (
        <div className="page-container add-property-page">
            {/* Inject Dialogues Here */}
            <SuccessDialogue open={!!successMsg} message={successMsg} onClose={handleDialogClose} />
            <ErrorDialogue open={!!errorMsg} message={errorMsg} onClose={handleDialogClose} />

            <div className="form-container">
                <h1>List Your Item</h1>
                <p className="form-subtitle">Fill in the details to post your rental listing.</p>

                <form onSubmit={handleSubmit} className="property-form">
                    <div className="form-group">
                        <label>Category</label>
                        <select name="category" value={formData.category} onChange={handleChange}>
                            <option value="real-estate">Real Estate</option>
                            <option value="vehicle">Vehicle</option>
                            <option value="furniture">Furniture</option>
                            <option value="appliances">Appliances</option>
                            <option value="electronics">Electronics</option>
                            <option value="package">Package</option>
                            <option value="baby-kids">Baby & Kids</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Title</label>
                        <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Modern Apartment" required />
                    </div>

                    <div className="form-row">
                        <div className="form-group"><label>Price (per month)</label><input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="e.g. 1200" required /></div>
                        <div className="form-group"><label>Type</label><input type="text" name="type" value={formData.type} onChange={handleChange} placeholder="e.g. apartment, sofa, sedan" required /></div>
                    </div>

                    <div className="form-group">
                        <label>Location</label>
                        <input type="text" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. 123 Main St, New York, NY" required />
                    </div>

                    {renderCategorySpecificFields()}

                    <div className="form-group">
                        <label>Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="5" placeholder="Describe the item features, condition, etc." required></textarea>
                    </div>

                    <div className="form-group">
                        <label>Image URL</label>
                        <input type="url" name="image_url" value={formData.image_url} onChange={handleChange} placeholder="https://example.com/image.jpg" />
                    </div>

                    <button type="submit" className="btn btn-primary submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Posting...' : 'Post Listing'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProperty;