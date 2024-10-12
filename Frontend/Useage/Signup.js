import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';

const Signup = () => {
  const [credentials, setCredentials] = useState({ name: '', email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = credentials;
    try {
      const res = await UserService.Signup(name, email, password);
      localStorage.setItem('token', res.token);
      window.location.reload();
    } catch (err) {
      if (err.response && err.response.data.error) {
        setErrorMessage(err.response.data.error);
      } else {
        console.error("Error during sign-up:", err.message);
      }
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrorMessage('');
  };

  return (
    <div className="container my-3">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            type="text"
            name="name"
            className={`form-control ${errorMessage ? 'is-invalid' : ''}`}
            id="name"
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
            type="email"
            name="email"
            className={`form-control ${errorMessage ? 'is-invalid' : ''}`}
            id="email"
            onChange={handleChange}
            required
          />
          {errorMessage && (
            <div className="invalid-feedback">
              {errorMessage}
            </div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            name="password"
            className="form-control"
            id="password"
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;