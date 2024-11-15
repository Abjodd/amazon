// frontend/src/services/api.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000', // Your backend URL
});

export default instance;
