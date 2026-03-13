import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Make sure this path is correct

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/admin?email=${email}&password=${password}`);
      const data = await response.json();

      if (data.length > 0) {
        localStorage.setItem('isAdmin', true);
        navigate('/admin');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default Login;
