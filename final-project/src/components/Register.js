import React, { useState } from 'react';
import axios from '../services/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [user, setUser] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/users', user);
      alert("Registered Successfully");
      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input type="text" placeholder="Username" value={user.username} onChange={e => setUser({...user, username: e.target.value})} required />
      <input type="email" placeholder="Email" value={user.email} onChange={e => setUser({...user, email: e.target.value})} required />
      <input type="password" placeholder="Password" value={user.password} onChange={e => setUser({...user, password: e.target.value})} required />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;