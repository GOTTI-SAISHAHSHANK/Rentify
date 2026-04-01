import React from 'react';
import '../styles/pages_css/Auth.css'; // Re-using Auth styles for the form look

const Contact = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Thank you for contacting us! We will get back to you soon.");
    };

    return (
        <div className="page-container">
            <div className="auth-container" style={{ maxWidth: '600px' }}>
                <h1 className="auth-title">Contact Us</h1>
                <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                    Have questions? We'd love to hear from you.
                </p>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Your Name</label>
                        <input type="text" placeholder="John Doe" required />
                    </div>
                    
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" placeholder="john@example.com" required />
                    </div>

                    <div className="form-group">
                        <label>Message</label>
                        <textarea 
                            rows="5" 
                            placeholder="How can we help you?" 
                            style={{ 
                                width: '100%', 
                                padding: '0.75rem', 
                                border: '1px solid var(--border-color)', 
                                borderRadius: 'var(--radius-md)' 
                            }} 
                            required 
                        ></textarea>
                    </div>

                    <button type="submit" className="btn btn-primary">Send Message</button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <p><strong>Email:</strong> support@rentify.com</p>
                    <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                    <p><strong>Address:</strong> 123 Rental Ave, Tech City</p>
                </div>
            </div>
        </div>
    );
};

export default Contact;