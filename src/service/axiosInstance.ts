import axios from "axios";

const BASE_URL ="http://localhost:3000"

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`, // Set the base URL once here
  headers: {
    "Content-Type": "application/json", // Set default headers if needed
  },
});

export default axiosInstance;