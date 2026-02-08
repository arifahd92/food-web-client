import { useState } from 'react';
import { useUser } from '@/shared/contexts/UserContext';
import { useNavigate, Navigate } from 'react-router-dom';

export default function RoleSelection() {
  const { login, role } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // Redirect if already logged in
  if (role === 'BUYER') {
    return <Navigate to="/menu" replace />;
  }
  if (role === 'SELLER') {
    return <Navigate to="/admin/orders" replace />;
  }

  const handleLogin = (role: 'BUYER' | 'SELLER') => {
    if (!email.trim() && role === 'BUYER') {
      setError('Please enter an email address to continue as a buyer.');
      return;
    }
    // For admin, we can default to a system email or just use the same input
    const userEmail = email.trim() || 'admin@system.com';
    
    login(role, userEmail);
    
    if (role === 'BUYER') {
      navigate('/menu');
    } else {
      navigate('/admin/orders');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome to Food Delivery</h1>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Enter your email to start
          </label>
          <input
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
          />
          {error && <p className="text-red-500 text-xs italic mt-2">{error}</p>}
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => handleLogin('BUYER')}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-colors"
          >
            Continue as Buyer
          </button>
          
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">Or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <button
            onClick={() => handleLogin('SELLER')}
            className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-colors"
          >
            Log in as Seller (Admin)
          </button>
        </div>
      </div>
    </div>
  );
}
