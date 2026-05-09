import axios from 'axios';
import { API_BASE_URL } from '../lib/apiConfig';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/reports`,
});

// Add a request interceptor to add the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const reportService = {
    sendReport: (formData) => api.post('/send', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }),
    getReports: (appointmentId) => api.get(`/${appointmentId}`),
};

export default reportService;
