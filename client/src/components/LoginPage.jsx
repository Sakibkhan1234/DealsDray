import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginPage.css'; 

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password: password.trim(),
      });
      console.log('Login response:', response.data); // Log the response
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('users', JSON.stringify(response.data.name)); 

        navigate('/dashboard'); 
      }
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
    }
};



  return (
    <div className='login-con'>
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="email"
          className="login-input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="login-input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="login-button">Login</button>
      </form>
      <p className="signup-link">
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
      </div>
    </div>
  );
};

export default LoginPage;
