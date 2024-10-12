import axios from 'axios';

const API_URL = "<api link provided by vercel>/api/auth";

// Function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('User authentication token is missing');
  }
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };
};

// Login User
const login = async (email, password) => {
  const response = await axios.post(`${API_URL}/login`, { email, password });
  return response.data;
};

// Create User
const Signup = async (name, email, password) => {
  const response = await axios.post(`${API_URL}/createUser`, { name, email, password });
  return response.data;
};

// Fetch logged-in user's details
const fetchUserDetails = async () => {
  const response = await axios.post(`${API_URL}/getUser`, {}, getAuthHeaders());
  return response.data;
};

const UserService = {
  login,
  Signup,
  fetchUserDetails
};

export default UserService;