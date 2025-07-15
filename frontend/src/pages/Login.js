import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('243Gc794');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();

  useEffect(() => {
    Swal.fire({
      icon: 'info',
      title: 'Demo Credentials',
      html: `
        <div style="text-align:left;">
          <p><strong>Email:</strong> admin@gmail.com <button id="copyEmail" class="swal2-styled swal2-default" style="margin-left:8px;">Copy</button></p>
          <p><strong>Password:</strong> 243Gc794 <button id="copyPassword" class="swal2-styled swal2-default" style="margin-left:8px;">Copy</button></p>
        </div>
      `,
      didOpen: () => {
        const copy = async (text, btnId) => {
          try {
            await navigator.clipboard.writeText(text);
            const btn = document.getElementById(btnId);
            btn.innerText = 'Copied!';
            setTimeout(() => (btn.innerText = 'Copy'), 1000);
          } catch {
            Swal.fire('Clipboard Permission Error', 'Please allow clipboard access or copy manually.', 'error');
          }
        };

        document.getElementById('copyEmail')?.addEventListener('click', () =>
          copy('admin@gmail.com', 'copyEmail')
        );
        document.getElementById('copyPassword')?.addEventListener('click', () =>
          copy('243Gc794', 'copyPassword')
        );
      },
      confirmButtonText: 'Got it!',
      confirmButtonColor: '#3085d6',
    });
  }, []);

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-96"
        name="loginForm"
        id="loginForm"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Kindly Login</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="email"
            disabled={isLoading}
          />
        </div>

        <div className="mb-4 relative">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoComplete="current-password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-8 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            disabled={isLoading}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        <button
          type="submit"
          className={`w-full py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
            isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
