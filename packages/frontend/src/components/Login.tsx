import { useAuth } from '@/auth/authContext';
import { API_URL } from '@/config';
import React, { useState } from 'react';

const Login: React.FC<{ history?: any }> = ({ history }) => {
  const { verifyToken } = useAuth();
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage('')
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        const { token } = await response.json();

        // Store token in local storage
        localStorage.setItem('token', token);
        verifyToken(token);
      } else {
        setErrorMessage('Unable to login, please try again')
      }
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage('Unable to login, Please check uername & password and try again.')
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-slate-900 text-black shadow-lg fixed top-0 w-full left-0">
      <div className="w-full md:w-1/3 bg-white shadow-sm p-5 rounded-lg">
        <h2 className="text-2xl mb-5 w-full text-center">Admin Control Panel</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1">Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          {errorMessage && <div className='border bg-red-500 text-white p-2'>{errorMessage}</div>}
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md" disabled={!formData.username || !formData.password}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
