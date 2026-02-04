import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login, user, loading: authLoading } = useAuth();

  // Handle Role-Based Redirection
  useEffect(() => {
    if (user) {
      if (user.role === 'admin' || user.role === 'superadmin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    setIsSubmitting(true);

    try {
      // The context's login handles the token storage and Axios headers
      await login(email, password);
      // Navigation is handled by the useEffect above once the 'user' state updates
    } catch (err: any) {
      // We catch the error here primarily to stop the local loading state
      setLocalError(err.response?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Prevent flicker if the context is still checking for an existing session
  if (authLoading && !user) {
    return (
      <div className='flex items-center justify-center min-h-screen bg-white dark:bg-gray-900'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-900 px-4'>
      <div className='w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md'>
        <h1 className='text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white'>Login</h1>

        {localError && (
          <div className='mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 rounded text-sm'>
            {localError}
          </div>
        )}

        <form onSubmit={handleLogin} className='space-y-5'>
          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Email Address
            </label>
            <input
              className='border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2.5 w-full rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition placeholder-gray-500 dark:placeholder-gray-400'
              type='email'
              placeholder='name@company.com'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Password
            </label>
            <input
              className='border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-2.5 w-full rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition placeholder-gray-500 dark:placeholder-gray-400'
              type='password'
              placeholder='••••••••'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className={`w-full py-3 rounded-md font-semibold text-white transition-all ${
              isSubmitting
                ? 'bg-blue-300 dark:bg-blue-900 cursor-not-allowed'
                : 'bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800'
            }`}
            type='submit'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <p className='mt-6 text-center text-gray-600 dark:text-gray-400'>
          Don't have an account?{' '}
          <Link
            to='/signup'
            className='text-blue-600 dark:text-blue-400 hover:underline font-medium'
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
