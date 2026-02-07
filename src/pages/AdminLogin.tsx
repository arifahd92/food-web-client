import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminId && password) {
      localStorage.setItem('adminId', adminId);
      localStorage.setItem('adminPassword', password);
      // Ideally verify with backend, but for now just redirect
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4 font-bold text-center">Admin Login</h2>
        <div className="mb-4">
          <label className="block mb-2">Admin ID</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2">Password</label>
          <input
            type="password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
