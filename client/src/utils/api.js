    import axios from "axios";

    // 1. Get the base URL using Vite's syntax
    const API_URL = import.meta.env.VITE_API_URL;

    // 2. Create a global Axios instance
    const api = axios.create({
    baseURL: API_URL,
    });

    // 3. Export the instance
    export default api;