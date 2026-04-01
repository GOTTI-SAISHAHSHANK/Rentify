// src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../repository/api';
import SuccessDialogue from '../common/SuccessDialogue';
import ErrorDialogue from '../common/ErrorDialogue';
import '../styles/pages_css/Auth.css';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
    
    // Dialogue States
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) { 
            setErrorMsg("Passwords do not match!"); 
            return; 
        }
        try {
            const payload = { ...formData };
            delete payload.confirmPassword;
            await api.register(payload);
            setSuccessMsg("Account created successfully! Please login.");
        } catch (err) {
            setErrorMsg(err.response?.data?.detail || "Registration failed.");
        }
    };

    return (
        <div className="page-container">
            <SuccessDialogue open={!!successMsg} message={successMsg} onClose={() => { setSuccessMsg(''); navigate('/login'); }} />
            <ErrorDialogue open={!!errorMsg} message={errorMsg} onClose={() => setErrorMsg('')} />

            <div className="auth-container">
                <h1 className="auth-title">Create Account</h1>
                
                <form className="auth-form" onSubmit={handleSubmit}>
                    {/* ... (Keep your exact same form inputs here) ... */}
                    <div className="form-row">
                        <div className="form-group"><label>First Name</label><input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required /></div>
                        <div className="form-group"><label>Last Name</label><input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required /></div>
                    </div>
                    <div className="form-group"><label>Email Address</label><input type="email" name="email" value={formData.email} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Phone Number</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 8900" required /></div>
                    <div className="form-group"><label>Password</label><input type="password" name="password" value={formData.password} onChange={handleChange} required /></div>
                    <div className="form-group"><label>Confirm Password</label><input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required /></div>
                    
                    <button type="submit" className="btn btn-primary">Sign Up</button>
                </form>
                
                <div className="auth-footer">Already have an account? <Link to="/login">Login</Link></div>
            </div>
        </div>
    );
};
export default Register;