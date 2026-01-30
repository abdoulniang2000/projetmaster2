import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8001/api', // Port 8001 où le serveur Laravel fonctionne
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
        console.error('URL:', error.config?.url || 'Unknown');
        console.error('Method:', error.config?.method || 'Unknown');
        console.error('Status:', error.response?.status || 'No response');
        console.error('Status Text:', error.response?.statusText || 'No response');
        console.error('Response Data:', error.response?.data || 'No response data');
        console.error('Error Message:', error.message);
        console.error('Full Error:', error);
        console.error('=== END AXIOS ERROR ===');

        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            delete axiosInstance.defaults.headers.common['Authorization'];
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
