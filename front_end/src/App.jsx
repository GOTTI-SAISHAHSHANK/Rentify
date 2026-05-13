import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Listings from './pages/Listings';
import PropertyDetails from './pages/PropertyDetails';
import AddProperty from './pages/AddProperty';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';    
import Contact from './pages/Contact'; 
import './App.css';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="listings" element={<Listings />} />
          <Route path="listings/:id" element={<PropertyDetails />} />
          <Route path="add-property" element={<AddProperty />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          {/* Add these two new routes */}
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="dashboard" element={<Dashboard />} />
          
        </Route>
      </Routes>
    </Router>
  );
}

export default App;