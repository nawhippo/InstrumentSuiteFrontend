import axios from 'axios';
import Cookies from 'js-cookie';
const backendBaseUrl = 'https://instrumentsuite-backend.onrender.com';
axios.defaults.baseURL = backendBaseUrl;


axios.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get('token')}`;

axios.interceptors.request.use(
    config => {
        const token = Cookies.get('token');
        console.log('Token in axios interceptor: ' + token);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);