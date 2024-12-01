import axios from "axios";

const api = axios.create({
    baseURL: 'http://localhost:8000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Request Interceptor
api.interceptors.request.use(
    (config) => {
        // Add auth token to headers
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // You can modify request config here
        // For example, add timestamp to prevent caching
        config.params = {
            ...config.params,
            _t: new Date().getTime()
        };

        return config;
    },
    (error) => {
        // Handle request errors here
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);


api.interceptors.response.use(
    (response) => {
        // Any status code between 200 and 299 triggers this function
        // You can modify the response data here
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // You could refresh the token here
                // const newToken = await refreshToken();
                // setCookie('authToken', newToken);
                // originalRequest.headers.Authorization = `Bearer ${newToken}`;
                // return api(originalRequest);
            } catch (refreshError) {
                // Handle refresh token failure
                // Maybe logout user and redirect to login
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Handle other common errors
        if (error.response?.status === 404) {
            console.error('Resource not found');
        }

        if (error.response?.status === 500) {
            console.error('Server error');
        }

        // You can handle network errors
        if (error.code === 'ECONNABORTED') {
            console.error('Request timeout');
        }

        // Network Error
        if (!error.response) {
            console.error('Network error');
        }

        return Promise.reject(error);
    }
);

export default api;