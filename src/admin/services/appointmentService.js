import axios from 'axios';
import { API_BASE_URL } from '../../lib/apiConfig';

const api = axios.create({
    baseURL: `${API_BASE_URL}/api/admin`,
});

// Add a request interceptor to add the JWT token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401 errors (unauthorized)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('adminToken');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

export const appointmentService = {
    getAppointments: (params) => api.get('/appointments', { params }),
    updateStatus: (id, status) => api.put(`/appointments/${id}/status`, { status }),
    deleteAppointment: (id) => api.delete(`/appointments/${id}`),
    exportAppointments: () => {
        return api.get('/appointments/export', { responseType: 'blob' })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'appointments.xlsx');
                document.body.appendChild(link);
                link.click();
                link.remove();
            });
    },
    getDashboardStats: () => api.get('/dashboard-stats'),
    getRecentAppointments: () => api.get('/recent-appointments'),
};

export default api;
