import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://localhost:5000', // Your backend's base URL
  timeout: 5000, // Optional: set a timeout for requests
});

export default instance;