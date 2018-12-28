import axios from 'axios';
import { TOKEN } from './SERVER_CONST';

// Add a request interceptor
const isLocal = true;

let axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_URL,
});


export default axiosInstance;