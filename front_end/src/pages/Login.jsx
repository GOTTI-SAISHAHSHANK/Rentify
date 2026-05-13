// src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../repository/api';
import SuccessDialogue from '../common/SuccessDialogue';
import ErrorDialogue from '../common/ErrorDialogue';
import '../styles/pages_css/Auth.css';

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    
    // Dialogue States
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    
    const [emailError, setEmailError] = useState(''); // Keep inline for field validation

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (e.target.name === 'email') setEmailError('');
    };

    const handleEmailBlur = async () => {
        if (!formData.email) return;
        try {
            const data = await api.checkEmail(formData.email);
            if (!data.exists) setEmailError("This email is not registered. Please sign up.");
            else setEmailError(""); 
        } catch (err) {
            console.error("Error checking email status:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (emailError) return; 

        try {
            const data = await api.login(formData);
            localStorage.setItem('user', JSON.stringify(data.user));
            window.dispatchEvent(new Event('storage'));
            setSuccessMsg(`Welcome back, ${data.user.firstName}!`);
        } catch (err) {
            setErrorMsg("Invalid email or password.");
        }
    };

    return (
        <div className="page-container">
            <SuccessDialogue open={!!successMsg} message={successMsg} onClose={() => { setSuccessMsg(''); navigate('/'); }} />
            <ErrorDialogue open={!!errorMsg} message={errorMsg} onClose={() => setErrorMsg('')} />

            <div className="auth-container">
                <h1 className="auth-title">Welcome Back</h1>
                
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} onBlur={handleEmailBlur} required />
                        {emailError && <div style={{color: 'red', marginTop: '0.5rem', fontSize: '0.9rem'}}>{emailError}</div>}
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={!!emailError}>Login</button>
                </form>
                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Sign up</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;