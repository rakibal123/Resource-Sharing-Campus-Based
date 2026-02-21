import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
// Standardize to the base host for clearer routing
export const BASE_URL = API_URL.replace('/api', '').replace(/\/$/, '');

const api = axios.create({
    baseURL: BASE_URL,
});

// Add a request interceptor to include the auth token in headers
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiration or unauthorized access
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Redirect to login page
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export const registerUser = async (userData: any) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
};

export const loginUser = async (credentials: any) => {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
};

export const fetchResources = async () => {
    const response = await api.get('/api/resources');
    return response.data;
};

export const addResource = async (resourceData: any) => {
    const response = await api.post('/api/resources', resourceData);
    return response.data;
};

export const requestResource = async (resourceId: string, borrowDate?: string, returnDate?: string) => {
    const response = await api.post('/api/requests', { resourceId, borrowDate, returnDate });
    return response.data;
};

export const fetchMyRequests = async () => {
    const response = await api.get('/api/requests/my-requests');
    return response.data;
};

export const adminFetchUsers = async () => {
    const response = await api.get('/api/admin/users');
    return response.data;
};

export const adminBlockUser = async (userId: string) => {
    const response = await api.put(`/api/admin/users/${userId}/block`);
    return response.data;
};

export const adminUnblockUser = async (userId: string) => {
    const response = await api.put(`/api/admin/users/${userId}/unblock`);
    return response.data;
};

export const adminDeleteUser = async (userId: string) => {
    const response = await api.delete(`/api/admin/users/${userId}`);
    return response.data;
};

export const adminFetchStats = async () => {
    const response = await api.get('/api/admin/stats');
    return response.data;
};

export const fetchAuditLogs = async () => {
    const response = await api.get('/api/admin/logs');
    return response.data;
};

export const updateRequestStatus = async (requestId: string, status: string) => {
    const response = await api.put(`/api/requests/${requestId}`, { status });
    return response.data;
};

export const cancelRequest = async (requestId: string) => {
    const response = await api.delete(`/api/requests/${requestId}`);
    return response.data;
};

export const fetchProfile = async () => {
    const response = await api.get('/api/users/profile');
    return response.data;
};

export const fetchUserStats = async () => {
    const response = await api.get('/api/users/stats');
    return response.data;
};

export default api;
