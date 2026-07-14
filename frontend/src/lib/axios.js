import axios from 'axios';

const Instance = axios.create({
    baseURL: 'https://mychat-app-0ia8.onrender.com/api',
    withCredentials: true,
});

export default Instance;