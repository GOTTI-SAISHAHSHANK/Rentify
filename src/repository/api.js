// src/repository/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const getEndpointByCategory = (category) => {
    switch (category) {
        case 'real-estate': return '/real_estate';
        case 'vehicle': return '/vehicles';
        case 'furniture': return '/furniture';
        case 'electronics': return '/electronics';
        case 'appliances': return '/appliances';
        case 'baby-kids': return '/baby_and_kids';
        case 'package': return '/package';
        default: return '/real_estate';
    }
};

export const api = {
    checkEmail: async (email) => {
        const response = await apiClient.get(`/auth/check-email?email=${encodeURIComponent(email)}`);
        return response.data;
    },

    register: async (userData) => {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data;
    },

    addItem: async (formData) => {
        const endpoint = getEndpointByCategory(formData.category);
        
        // CRITICAL FIX: Strip 'category' from the payload before sending to FastAPI
        const { category, ...payloadToSend } = formData; 
        
        const response = await apiClient.post(`${endpoint}/add_or_update`, payloadToSend);
        return response.data;
    },

    getItemsByCategory: async (category) => {
        const endpoint = getEndpointByCategory(category);
        const response = await apiClient.get(`${endpoint}/`);
        return response.data.map(item => ({ ...item, category: category }));
    },

    getAllItems: async () => {
        const categories = [
            'real-estate', 'vehicle', 'furniture', 'electronics', 'appliances', 'baby-kids', 'package'
        ];
        const requests = categories.map(cat => api.getItemsByCategory(cat).catch(err => []));
        const results = await Promise.all(requests);
        return results.flat();
    },

    getItemById: async (id, category) => {
        if (category) {
            try {
                const endpoint = getEndpointByCategory(category);
                const response = await apiClient.get(`${endpoint}/${id}`);
                return { ...response.data, category };
            } catch (e) { /* Fall through */ }
        }
        
        const categories = [
            'real-estate', 'vehicle', 'furniture', 'electronics', 'appliances', 'baby-kids', 'package'
        ];

        for (const cat of categories) {
            try {
                const endpoint = getEndpointByCategory(cat);
                const response = await apiClient.get(`${endpoint}/${id}`);
                if (response.data) {
                    return { ...response.data, category: cat };
                }
            } catch (e) { /* continue */ }
        }
        throw new Error('Item not found in any category');
    },

    getItemsByUserId: async (userId) => {
        const categories = [
            'real-estate', 'vehicle', 'furniture', 'electronics', 'appliances', 'baby-kids', 'package'
        ];
        
        const requests = categories.map(async (cat) => {
            try {
                const endpoint = getEndpointByCategory(cat);
                const response = await apiClient.get(`${endpoint}/user/${userId}`);
                return response.data.map(item => ({ ...item, category: cat }));
            } catch (err) {
                return []; 
            }
        });
        
        const results = await Promise.all(requests);
        return results.flat();
    },

    // Handles the PATCH request for updating rental status
    updateItemStatus: async (id, category, status) => {
        const endpoint = getEndpointByCategory(category);
        const response = await apiClient.patch(`${endpoint}/${id}/status`, { status });
        return response.data;
    },

    // NEW: Function to handle DELETE request
    deleteItem: async (id, category, userId) => {
        const endpoint = getEndpointByCategory(category);
        const response = await apiClient.delete(`${endpoint}/${id}?user_id=${userId}`);
        return response.data;
    }
};