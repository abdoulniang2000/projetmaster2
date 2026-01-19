import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8001/api', // Corrigé : enlever /v1 pour éviter le double /v1/v1
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

// Intercepteur pour ajouter le token JWT à chaque requête
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Gestion des erreurs
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('=== AXIOS ERROR INTERCEPTOR ===');
        console.error('Error details:', {
            message: error.message,
            code: error.code,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            config: {
                url: error.config?.url,
                method: error.config?.method,
                baseURL: error.config?.baseURL,
                headers: error.config?.headers
            }
        });

        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            delete axiosInstance.defaults.headers.common['Authorization'];
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
